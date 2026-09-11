// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ILunchV3Launcher, ILunchV3Router} from "./LunchAtomicExecutor.sol";

interface ILunch7702Buyer {
    function executeBuy(address token, uint24 fee, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96, uint256 deadline, uint256 nonce, bytes calldata signature)
        external returns (uint256 amountOut);
}

/// @notice Code delegated to each buyer EOA through EIP-7702.
/// @dev Executes in the buyer EOA's context, so the router observes that EOA as msg.sender.
contract Lunch7702BuyerDelegate {
    using ECDSA for bytes32;

    bytes32 private constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant BUY_TYPEHASH = keccak256("AuthorizedBuy(address token,uint24 fee,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96,uint256 deadline,uint256 nonce)");
    bytes32 private constant NAME_HASH = keccak256("Lunch7702Buyer");
    bytes32 private constant VERSION_HASH = keccak256("1");
    bytes32 private constant NONCE_SLOT = keccak256("rh-launch.lunch7702.execution-nonce.v1");
    address public immutable coordinator;
    ILunchV3Router public immutable router;
    address public immutable xToken;

    error Unauthorized();
    error ExpiredAuthorization();
    error InvalidNonce();
    error InvalidSignature();

    constructor(address coordinator_, address router_, address xToken_) {
        coordinator = coordinator_;
        router = ILunchV3Router(router_);
        xToken = xToken_;
    }

    function executionNonce() public view returns (uint256 value) {
        bytes32 slot = NONCE_SLOT;
        assembly { value := sload(slot) }
    }

    function executeBuy(address token, uint24 fee, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96, uint256 deadline, uint256 nonce, bytes calldata signature)
        external returns (uint256 amountOut)
    {
        if (msg.sender != coordinator) revert Unauthorized();
        if (block.timestamp > deadline) revert ExpiredAuthorization();
        if (nonce != executionNonce()) revert InvalidNonce();
        bytes32 domainSeparator = keccak256(abi.encode(DOMAIN_TYPEHASH, NAME_HASH, VERSION_HASH, block.chainid, address(this)));
        bytes32 structHash = keccak256(abi.encode(BUY_TYPEHASH, token, fee, amountIn, amountOutMinimum, sqrtPriceLimitX96, deadline, nonce));
        if (keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash)).recover(signature) != address(this)) revert InvalidSignature();
        bytes32 slot = NONCE_SLOT;
        assembly { sstore(slot, add(nonce, 1)) }
        ILunchV3Router.ExactInputSingleParams memory params = ILunchV3Router.ExactInputSingleParams({
            tokenIn: xToken,
            tokenOut: token,
            fee: fee,
            recipient: address(this),
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: sqrtPriceLimitX96
        });
        return router.exactInputSingle{value: amountIn}(params);
    }
}

/// @notice Launches Lunch.fun and calls separately delegated buyer EOAs in one atomic transaction.
contract Lunch7702AtomicCoordinator is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct LaunchParams {
        string name;
        string symbol;
        uint256 totalSupply;
        uint24 fee;
        ILunchV3Launcher.Meta meta;
        bytes32 userSalt;
        uint256 deadline;
    }

    struct Buyer {
        address account;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
        uint256 nonce;
        bytes signature;
    }

    ILunchV3Launcher public immutable launcher;
    address public immutable delegateImplementation;

    error InvalidConfiguration();
    error InvalidBuyer();
    error DuplicateBuyer();
    error Expired();
    error OwnershipRenunciationDisabled();
    error ExternalCallFailed(bytes reason);

    event Atomic7702Launch(address indexed token, uint256 indexed tokenId, uint256 buyerCount);
    event BuyerExecuted(address indexed buyer, address indexed token, uint256 amountIn, uint256 amountOut);

    constructor(address launcher_, address delegateImplementation_) {
        if (launcher_ == address(0) || delegateImplementation_ == address(0)) revert InvalidConfiguration();
        launcher = ILunchV3Launcher(launcher_);
        delegateImplementation = delegateImplementation_;
    }

    function launchAndBuy(LaunchParams calldata params, Buyer[] calldata buyers)
        external payable onlyOwner nonReentrant returns (address token, uint256 tokenId, uint256[] memory amountsOut)
    {
        if (block.timestamp > params.deadline) revert Expired();
        if (params.fee != 10_000 || buyers.length == 0) revert InvalidConfiguration();
        uint256 launchFee = launcher.launchFeeWei();
        if (msg.value != launchFee) revert InvalidConfiguration();

        for (uint256 i; i < buyers.length; ++i) {
            if (buyers[i].account == address(0) || buyers[i].amountIn == 0 || buyers[i].amountOutMinimum == 0) revert InvalidBuyer();
            if (buyers[i].account.codehash != keccak256(abi.encodePacked(hex"ef0100", delegateImplementation))) revert InvalidBuyer();
            for (uint256 j; j < i; ++j) if (buyers[j].account == buyers[i].account) revert DuplicateBuyer();
        }

        (token, tokenId) = _launch(params, launchFee);

        amountsOut = new uint256[](buyers.length);
        for (uint256 i; i < buyers.length; ++i) {
            amountsOut[i] = ILunch7702Buyer(buyers[i].account).executeBuy(
                token, params.fee, buyers[i].amountIn, buyers[i].amountOutMinimum, buyers[i].sqrtPriceLimitX96,
                params.deadline, buyers[i].nonce, buyers[i].signature
            );
            emit BuyerExecuted(buyers[i].account, token, buyers[i].amountIn, amountsOut[i]);
        }
        emit Atomic7702Launch(token, tokenId, buyers.length);
    }

    function _launch(LaunchParams calldata params, uint256 launchFee) private returns (address token, uint256 tokenId) {
        return launcher.launchWithMetaSalt{value: launchFee}(
            params.name, params.symbol, params.totalSupply, params.fee, 0, params.meta, params.userSalt
        );
    }

    function creatorCall(address target, bytes calldata data) external onlyOwner nonReentrant returns (bytes memory result) {
        (bool ok, bytes memory returned) = target.call(data);
        if (!ok) revert ExternalCallFailed(returned);
        return returned;
    }

    function recoverToken(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        IERC20(token).safeTransfer(recipient, amount);
    }

    function withdrawETH(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        (bool ok, bytes memory returned) = recipient.call{value: amount}("");
        if (!ok) revert ExternalCallFailed(returned);
    }

    function renounceOwnership() public override onlyOwner { revert OwnershipRenunciationDisabled(); }
}

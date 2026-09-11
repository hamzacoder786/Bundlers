// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface ILunchV3Launcher {
    struct Meta {
        string image;
        string banner;
        string description;
        string website;
        string twitter;
        string telegram;
    }

    function launchFeeWei() external view returns (uint256);

    function launchWithMetaSalt(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        Meta calldata meta,
        bytes32 userSalt
    ) external payable returns (address token, uint256 tokenId);
}

interface ILunchV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

/// @title Atomic Lunch.fun launcher and buyer
/// @notice Launches a Lunch.fun token and performs all configured buys inside one transaction.
/// @dev This contract, rather than the controlling EOA, is recorded as the Lunch.fun creator.
contract LunchAtomicExecutor is Ownable2Step, ReentrancyGuard {
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

    struct Buy {
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    ILunchV3Launcher public immutable launcher;
    ILunchV3Router public immutable router;
    address public immutable xToken;

    error IncorrectValue(uint256 expected, uint256 received);
    error InvalidAddress();
    error InvalidFee();
    error EmptyBuy();
    error Expired();
    error OwnershipRenunciationDisabled();
    error ExternalCallFailed(bytes reason);

    event AtomicLaunch(
        address indexed token,
        uint256 indexed tokenId,
        address indexed controller,
        uint256 buyCount
    );
    event AtomicBuy(address indexed token, address indexed recipient, uint256 amountIn, uint256 amountOut);
    event CreatorCall(address indexed target, uint256 value, bytes data, bytes result);
    event Recovered(address indexed asset, address indexed recipient, uint256 amount);

    constructor(address launcher_, address router_, address xToken_) {
        if (launcher_ == address(0) || router_ == address(0) || xToken_ == address(0)) revert InvalidAddress();
        launcher = ILunchV3Launcher(launcher_);
        router = ILunchV3Router(router_);
        xToken = xToken_;
    }

    /// @notice Atomically launches and buys. Any failure reverts the launch and every buy.
    function launchAndBuy(LaunchParams calldata params, Buy[] calldata buys)
        external
        payable
        onlyOwner
        nonReentrant
        returns (address token, uint256 tokenId, uint256[] memory amountsOut)
    {
        if (params.fee != 10_000) revert InvalidFee();
        if (block.timestamp > params.deadline) revert Expired();

        uint256 buyValue;
        for (uint256 i; i < buys.length; ++i) {
            if (buys[i].recipient == address(0) || buys[i].amountIn == 0 || buys[i].amountOutMinimum == 0) {
                revert EmptyBuy();
            }
            buyValue += buys[i].amountIn;
        }

        uint256 launchFee = launcher.launchFeeWei();
        uint256 expectedValue = launchFee + buyValue;
        if (msg.value != expectedValue) revert IncorrectValue(expectedValue, msg.value);

        (token, tokenId) = _launch(params, launchFee);

        uint256 executorTokenBalance = IERC20(token).balanceOf(address(this));
        if (executorTokenBalance != 0) IERC20(token).safeTransfer(owner(), executorTokenBalance);

        amountsOut = _executeBuys(token, params.fee, buys);
        emit AtomicLaunch(token, tokenId, msg.sender, buys.length);
    }

    function _launch(LaunchParams calldata params, uint256 launchValue)
        private
        returns (address token, uint256 tokenId)
    {
        return launcher.launchWithMetaSalt{value: launchValue}(
            params.name,
            params.symbol,
            params.totalSupply,
            params.fee,
            0,
            params.meta,
            params.userSalt
        );
    }

    function _executeBuys(address token, uint24 fee, Buy[] calldata buys)
        private
        returns (uint256[] memory amountsOut)
    {
        amountsOut = new uint256[](buys.length);
        for (uint256 i; i < buys.length; ++i) {
            ILunchV3Router.ExactInputSingleParams memory swapParams = ILunchV3Router.ExactInputSingleParams({
                tokenIn: xToken,
                tokenOut: token,
                fee: fee,
                recipient: buys[i].recipient,
                amountIn: buys[i].amountIn,
                amountOutMinimum: buys[i].amountOutMinimum,
                sqrtPriceLimitX96: buys[i].sqrtPriceLimitX96
            });
            amountsOut[i] = router.exactInputSingle{value: buys[i].amountIn}(swapParams);
            emit AtomicBuy(token, buys[i].recipient, buys[i].amountIn, amountsOut[i]);
        }
    }

    /// @notice Performs an owner-approved call as the Lunch.fun creator contract.
    /// @dev Use for fee-locker creator settings or recovery; simulate the call before submitting.
    function creatorCall(address target, uint256 value, bytes calldata data)
        external
        payable
        onlyOwner
        nonReentrant
        returns (bytes memory result)
    {
        if (target == address(0)) revert InvalidAddress();
        if (msg.value != value) revert IncorrectValue(value, msg.value);
        (bool ok, bytes memory returned) = target.call{value: value}(data);
        if (!ok) revert ExternalCallFailed(returned);
        emit CreatorCall(target, value, data, returned);
        return returned;
    }

    function recoverETH(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        if (recipient == address(0)) revert InvalidAddress();
        (bool ok, bytes memory reason) = recipient.call{value: amount}("");
        if (!ok) revert ExternalCallFailed(reason);
        emit Recovered(address(0), recipient, amount);
    }

    function recoverToken(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0) || recipient == address(0)) revert InvalidAddress();
        IERC20(token).safeTransfer(recipient, amount);
        emit Recovered(token, recipient, amount);
    }

    function renounceOwnership() public override onlyOwner {
        revert OwnershipRenunciationDisabled();
    }

    receive() external payable {}
}

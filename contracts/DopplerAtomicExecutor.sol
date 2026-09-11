// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IAirlock, IUniversalRouter, PoolKey} from "./interfaces/IDoppler.sol";

/// @title Atomic Doppler (Airlock) launcher and buyer
/// @notice Launches a token through Doppler's Airlock and performs configured
/// V4 buys through the Universal Router inside one transaction.
/// @dev Module addresses (tokenFactory, governanceFactory, poolInitializer,
/// liquidityMigrator) are NOT chosen by this contract — Airlock.create()
/// reverts unless each is already whitelisted by the Airlock owner. This
/// contract only assembles the call; it does not grant itself any modules.
contract DopplerAtomicExecutor is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @dev V4_SWAP is Universal Router command 0x10, confirmed from a real
    /// swap transaction against this chain's deployed router.
    bytes1 private constant CMD_V4_SWAP = 0x10;

    /// @dev Inner V4 router actions, per Uniswap's v4-periphery Actions library.
    uint8 private constant ACTION_SWAP_EXACT_IN_SINGLE = 0x06;
    uint8 private constant ACTION_SETTLE_ALL = 0x0b;
    uint8 private constant ACTION_TAKE_ALL = 0x0e;

    /// @dev Uniswap V4 dynamic-fee flag (LPFeeLibrary.DYNAMIC_FEE_FLAG). Doppler
    /// pools use a hook-computed fee, not a static tier — confirmed from a real
    /// Initialize event on this deployment's PoolManager (fee: 8388608 == 0x800000).
    uint24 private constant DYNAMIC_FEE_FLAG = 0x800000;

    struct Buy {
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    IAirlock public immutable airlock;
    IUniversalRouter public immutable router;

    /// @dev Fixed for this Doppler deployment's poolInitializer/hook and pool
    /// tickSpacing — confirmed from the same Initialize event, not caller input.
    /// Airlock.create() must be called with a poolInitializer matching `hooks`
    /// below, or the launched pool will not match these buy parameters.
    address public immutable hooks;
    int24 public immutable tickSpacing;

    error EmptyBuy();
    error Expired();
    error OwnershipRenunciationDisabled();
    error ExternalCallFailed(bytes reason);

    event AtomicLaunch(address indexed asset, address indexed pool, address indexed controller, uint256 buyCount);
    event AtomicBuy(address indexed asset, address indexed recipient, uint256 amountIn, uint256 amountOutMinimum);
    event Recovered(address indexed asset, address indexed recipient, uint256 amount);

    constructor(address airlock_, address router_, address hooks_, int24 tickSpacing_) {
        require(airlock_ != address(0) && router_ != address(0) && hooks_ != address(0), "zero addr");
        airlock = IAirlock(airlock_);
        router = IUniversalRouter(router_);
        hooks = hooks_;
        tickSpacing = tickSpacing_;
    }

    /// @notice Atomically launches through Airlock.create() then buys the
    /// freshly created asset for each configured recipient. Any failure
    /// reverts the launch and every buy.
    /// @param createData Forwarded verbatim to Airlock.create(); the caller
    /// is responsible for using module addresses already whitelisted on the
    /// target Airlock deployment and for correctly encoding each module's
    /// opaque data payload.
    /// @param buys Native-currency buys against the newly created pool. The
    /// pool key's hooks/tickSpacing/fee are fixed at deployment (see `hooks`
    /// and `tickSpacing`) to match this Airlock deployment's poolInitializer;
    /// they are not re-derived from `create()`'s return values.
    /// @param numeraireIsNative Whether `createData.numeraire` is the chain's
    /// native asset (address(0) equivalent in the pool key) — set to match
    /// however this Airlock deployment represents native currency.
    /// @param deadline Universal Router execute() deadline.
    function launchAndBuy(
        IAirlock.CreateParams calldata createData,
        Buy[] calldata buys,
        bool numeraireIsNative,
        uint256 deadline
    )
        external
        payable
        onlyOwner
        nonReentrant
        returns (address asset, address pool)
    {
        if (block.timestamp > deadline) revert Expired();

        uint256 buyValue;
        for (uint256 i; i < buys.length; ++i) {
            if (buys[i].recipient == address(0) || buys[i].amountIn == 0 || buys[i].amountOutMinimum == 0) {
                revert EmptyBuy();
            }
            buyValue += buys[i].amountIn;
        }

        address governance;
        address timelock;
        address migrationPool;
        (asset, pool, governance, timelock, migrationPool) = airlock.create(createData);

        _executeBuys(asset, createData.numeraire, numeraireIsNative, buys, deadline);

        emit AtomicLaunch(asset, pool, msg.sender, buys.length);
    }

    function _executeBuys(
        address asset,
        address numeraire,
        bool numeraireIsNative,
        Buy[] calldata buys,
        uint256 deadline
    ) private {
        address currencyIn = numeraireIsNative ? address(0) : numeraire;
        bool zeroForOne = currencyIn < asset;

        PoolKey memory key = zeroForOne
            ? PoolKey({
                currency0: currencyIn,
                currency1: asset,
                fee: DYNAMIC_FEE_FLAG,
                tickSpacing: tickSpacing,
                hooks: hooks
            })
            : PoolKey({
                currency0: asset,
                currency1: currencyIn,
                fee: DYNAMIC_FEE_FLAG,
                tickSpacing: tickSpacing,
                hooks: hooks
            });

        for (uint256 i; i < buys.length; ++i) {

            bytes memory actions = abi.encodePacked(ACTION_SWAP_EXACT_IN_SINGLE, ACTION_SETTLE_ALL, ACTION_TAKE_ALL);

            // TAKE_ALL params are (currency, recipient) on this router, per
            // the decoded reference swap — the router delivers output tokens
            // straight to `recipient`, it does not return them to msg.sender.
            bytes[] memory params = new bytes[](3);
            params[0] = abi.encode(key, zeroForOne, buys[i].amountIn, buys[i].amountOutMinimum, bytes(""));
            params[1] = abi.encode(currencyIn, buys[i].amountIn);
            params[2] = abi.encode(asset, buys[i].recipient);

            bytes[] memory inputs = new bytes[](1);
            inputs[0] = abi.encode(actions, params);

            router.execute{value: buys[i].amountIn}(abi.encodePacked(CMD_V4_SWAP), inputs, deadline);

            emit AtomicBuy(asset, buys[i].recipient, buys[i].amountIn, buys[i].amountOutMinimum);
        }
    }

    function recoverETH(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "zero addr");
        (bool ok, bytes memory reason) = recipient.call{value: amount}("");
        if (!ok) revert ExternalCallFailed(reason);
        emit Recovered(address(0), recipient, amount);
    }

    function recoverToken(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(token != address(0) && recipient != address(0), "zero addr");
        IERC20(token).safeTransfer(recipient, amount);
        emit Recovered(token, recipient, amount);
    }

    function renounceOwnership() public override onlyOwner {
        revert OwnershipRenunciationDisabled();
    }

    receive() external payable {}
}

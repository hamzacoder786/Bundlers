// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.17 <0.9.0;

/// @dev Minimal interfaces for the Doppler Airlock launcher and the Uniswap V4
/// Universal Router, reconstructed from Airlock.sol and a decoded on-chain
/// create() + execute() transaction on Robinhood Chain. Only the pieces the
/// executor needs are declared here.

enum ModuleState {
    NotWhitelisted,
    TokenFactory,
    GovernanceFactory,
    PoolInitializer,
    LiquidityMigrator
}

interface ITokenFactory {
    function create(
        uint256 initialSupply,
        address recipient,
        address owner,
        bytes32 salt,
        bytes calldata data
    ) external returns (address);
}

interface IGovernanceFactory {
    function create(address asset, bytes calldata data) external returns (address governance, address timelock);
}

interface IPoolInitializer {
    function initialize(
        address asset,
        address numeraire,
        uint256 numTokensToSell,
        bytes32 salt,
        bytes calldata data
    ) external returns (address pool);
}

interface ILiquidityMigrator {
    function initialize(address asset, address numeraire, bytes calldata data) external returns (address migrationPool);
}

interface IAirlock {
    struct CreateParams {
        uint256 initialSupply;
        uint256 numTokensToSell;
        address numeraire;
        ITokenFactory tokenFactory;
        bytes tokenFactoryData;
        IGovernanceFactory governanceFactory;
        bytes governanceFactoryData;
        IPoolInitializer poolInitializer;
        bytes poolInitializerData;
        ILiquidityMigrator liquidityMigrator;
        bytes liquidityMigratorData;
        address integrator;
        bytes32 salt;
    }

    function create(CreateParams calldata createData)
        external
        returns (address asset, address pool, address governance, address timelock, address migrationPool);

    function getModuleState(address module) external view returns (ModuleState);
}

/// @dev Uniswap V4 PoolKey, matches v4-core's Pools.PoolKey layout exactly
/// (currency ordering, fee, tickSpacing, hooks). Field order is load-bearing.
struct PoolKey {
    address currency0;
    address currency1;
    uint24 fee;
    int24 tickSpacing;
    address hooks;
}

/// @dev Uniswap Universal Router entrypoint. `commands` is a packed byte
/// string of command ids; `inputs[i]` is the ABI-encoded parameter blob for
/// commands[i]. Command 0x10 = V4_SWAP (confirmed from a real Robinhood Chain
/// swap transaction against this deployment's UniversalRouter).
interface IUniversalRouter {
    function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable;
}

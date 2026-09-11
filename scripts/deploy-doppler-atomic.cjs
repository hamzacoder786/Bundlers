const hre = require("hardhat");

// Confirmed by decoding a real create() transaction and its logs on
// Robinhood Chain: 0x03104945f944e0ff29691185b5f42b99ae156b1359099405b2150078c3787323
const AIRLOCK = "0xeb7C034704eF8Dcd2D32324c1545f62fB4aD0862";
const UNIVERSAL_ROUTER = "0x8876789976dEcBfCbBbe364623C63652db8C0904";
const HOOKS = "0x4e3468951D49f2EEa976eD0D6e75fFCb44a9a544"; // also this deployment's poolInitializer
const TICK_SPACING = 200;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) throw new Error("Set LUNCH_LAUNCHER_PRIVATE_KEY before deploying.");

  const airlock = process.env.DOPPLER_AIRLOCK || AIRLOCK;
  const router = process.env.DOPPLER_ROUTER || UNIVERSAL_ROUTER;
  const hooks = process.env.DOPPLER_HOOKS || HOOKS;
  const tickSpacing = process.env.DOPPLER_TICK_SPACING || TICK_SPACING;

  const factory = await hre.ethers.getContractFactory("DopplerAtomicExecutor");
  const executor = await factory.deploy(airlock, router, hooks, tickSpacing);
  await executor.waitForDeployment();

  console.log(`Owner: ${deployer.address}`);
  console.log(`DOPPLER_ATOMIC_EXECUTOR=${await executor.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");

const LUNCH_LAUNCHER = "0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6";
const DEFAULT_ROUTER = "0xCaf681a66D020601342297493863E78C959E5cb2";
const DEFAULT_X_TOKEN = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) throw new Error("Set LUNCH_LAUNCHER_PRIVATE_KEY before deploying.");

  const router = process.env.LUNCH_ROUTER || DEFAULT_ROUTER;
  const xToken = process.env.LUNCH_X_TOKEN || DEFAULT_X_TOKEN;
  const factory = await hre.ethers.getContractFactory("LunchAtomicExecutor");
  const executor = await factory.deploy(LUNCH_LAUNCHER, router, xToken);
  await executor.waitForDeployment();

  console.log(`Owner: ${deployer.address}`);
  console.log(`LUNCH_ATOMIC_EXECUTOR=${await executor.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

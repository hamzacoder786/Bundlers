const hre = require("hardhat");

const LAUNCHER = "0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6";
const ROUTER = "0xCaf681a66D020601342297493863E78C959E5cb2";
const X_TOKEN = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) throw new Error("Set LUNCH_LAUNCHER_PRIVATE_KEY.");
  const nonce = await deployer.getNonce("pending");
  const predictedCoordinator = hre.ethers.getCreateAddress({ from: deployer.address, nonce: nonce + 1 });

  const delegateFactory = await hre.ethers.getContractFactory("Lunch7702BuyerDelegate");
  const delegate = await delegateFactory.deploy(predictedCoordinator, ROUTER, X_TOKEN, { nonce });
  await delegate.waitForDeployment();

  const coordinatorFactory = await hre.ethers.getContractFactory("Lunch7702AtomicCoordinator");
  const coordinator = await coordinatorFactory.deploy(LAUNCHER, await delegate.getAddress(), { nonce: nonce + 1 });
  await coordinator.waitForDeployment();
  if ((await coordinator.getAddress()).toLowerCase() !== predictedCoordinator.toLowerCase()) {
    throw new Error("Coordinator address prediction mismatch.");
  }

  console.log(`Owner: ${deployer.address}`);
  console.log(`LUNCH_7702_DELEGATE=${await delegate.getAddress()}`);
  console.log(`LUNCH_7702_COORDINATOR=${await coordinator.getAddress()}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });

const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Lunch7702AtomicCoordinator", function () {
  it("makes each delegated EOA the router caller in one atomic execution", async function () {
    const [owner, buyer1, buyer2] = await ethers.getSigners();
    const launcher = await (await ethers.getContractFactory("MockLunchLauncher")).deploy();
    const router = await (await ethers.getContractFactory("MockLunchRouter")).deploy();
    const nonce = await owner.getNonce();
    const predictedCoordinator = ethers.getCreateAddress({ from: owner.address, nonce: nonce + 1 });
    const delegate = await (await ethers.getContractFactory("Lunch7702BuyerDelegate")).deploy(
      predictedCoordinator, await router.getAddress(), ethers.Wallet.createRandom().address, { nonce }
    );
    const coordinator = await (await ethers.getContractFactory("Lunch7702AtomicCoordinator")).deploy(
      await launcher.getAddress(), await delegate.getAddress(), { nonce: nonce + 1 }
    );
    expect(await coordinator.getAddress()).to.equal(predictedCoordinator);

    const designator = `0xef0100${(await delegate.getAddress()).slice(2).toLowerCase()}`;
    await network.provider.send("hardhat_setCode", [buyer1.address, designator]);
    await network.provider.send("hardhat_setCode", [buyer2.address, designator]);

    const params = {
      name: "7702 Lunch", symbol: "L77", totalSupply: ethers.parseEther("1000000"), fee: 10000,
      meta: { image: "", banner: "", description: "", website: "", twitter: "", telegram: "" },
      userSalt: ethers.id("7702-test"), deadline: Math.floor(Date.now() / 1000) + 3600,
    };
    const predictedToken = ethers.getCreateAddress({ from: await launcher.getAddress(), nonce: 1 });
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const types = { AuthorizedBuy: [
      { name: "token", type: "address" }, { name: "fee", type: "uint24" }, { name: "amountIn", type: "uint256" },
      { name: "amountOutMinimum", type: "uint256" }, { name: "sqrtPriceLimitX96", type: "uint160" },
      { name: "deadline", type: "uint256" }, { name: "nonce", type: "uint256" },
    ] };
    async function authorizedBuyer(signer, amountIn) {
      const value = { token: predictedToken, fee: 10000, amountIn, amountOutMinimum: 1n, sqrtPriceLimitX96: 0n, deadline: params.deadline, nonce: 0n };
      const signature = await signer.signTypedData({ name: "Lunch7702Buyer", version: "1", chainId, verifyingContract: signer.address }, types, value);
      return { account: signer.address, amountIn, amountOutMinimum: 1n, sqrtPriceLimitX96: 0n, nonce: 0n, signature };
    }
    const buyers = [await authorizedBuyer(buyer1, 1000n), await authorizedBuyer(buyer2, 2000n)];
    await expect(coordinator.launchAndBuy(params, buyers, { value: ethers.parseEther("0.01") }))
      .to.emit(coordinator, "Atomic7702Launch");
    expect(await router.spendByCaller(buyer1.address)).to.equal(1000n);
    expect(await router.spendByCaller(buyer2.address)).to.equal(2000n);
    const token = await ethers.getContractAt("MockLunchToken", await launcher.lastToken());
    expect(await token.balanceOf(buyer1.address)).to.equal(500000n);
    expect(await token.balanceOf(buyer2.address)).to.equal(1000000n);
  });
});

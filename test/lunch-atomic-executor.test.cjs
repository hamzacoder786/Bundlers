const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LunchAtomicExecutor", function () {
  async function deploy() {
    const [owner, recipient1, recipient2, stranger] = await ethers.getSigners();
    const launcher = await (await ethers.getContractFactory("MockLunchLauncher")).deploy();
    const router = await (await ethers.getContractFactory("MockLunchRouter")).deploy();
    const executor = await (await ethers.getContractFactory("LunchAtomicExecutor")).deploy(
      await launcher.getAddress(), await router.getAddress(), ethers.Wallet.createRandom().address
    );
    return { owner, recipient1, recipient2, stranger, launcher, executor };
  }

  function launchParams(owner) {
    return {
      name: "Atomic Lunch", symbol: "ATOM", totalSupply: ethers.parseEther("1000000"), fee: 10000,
      meta: { image: "", banner: "", description: "", website: "", twitter: "", telegram: "" },
      userSalt: ethers.id("atomic-test"),
      deadline: Math.floor(Date.now() / 1000) + 3600,
    };
  }

  it("launches and delivers every buy in one transaction", async function () {
    const { owner, recipient1, recipient2, launcher, executor } = await deploy();
    const params = launchParams(owner);
    const buys = [
      { recipient: recipient1.address, amountIn: ethers.parseEther("0.01"), amountOutMinimum: 1n, sqrtPriceLimitX96: 0n },
      { recipient: recipient2.address, amountIn: ethers.parseEther("0.03"), amountOutMinimum: 1n, sqrtPriceLimitX96: 0n },
    ];
    const value = ethers.parseEther("0.05");
    await expect(executor.launchAndBuy(params, buys, { value })).to.emit(executor, "AtomicLaunch");

    expect(await launcher.lastCreator()).to.equal(await executor.getAddress());
    const token = await ethers.getContractAt("MockLunchToken", await launcher.lastToken());
    expect(await token.balanceOf(owner.address)).to.equal(0n);
    expect(await token.balanceOf(recipient1.address)).to.equal(buys[0].amountIn * 500n);
    expect(await token.balanceOf(recipient2.address)).to.equal(buys[1].amountIn * 500n);
  });

  it("reverts the entire launch when a later buy misses its minimum", async function () {
    const { owner, recipient1, launcher, executor } = await deploy();
    const params = launchParams(owner);
    const buys = [{
      recipient: recipient1.address, amountIn: ethers.parseEther("0.01"),
      amountOutMinimum: ethers.parseEther("100"), sqrtPriceLimitX96: 0n,
    }];
    await expect(executor.launchAndBuy(params, buys, { value: ethers.parseEther("0.02") })).to.be.revertedWith("minimum");
    expect(await launcher.lastToken()).to.equal(ethers.ZeroAddress);
  });

  it("only allows its owner to launch", async function () {
    const { owner, recipient1, stranger, executor } = await deploy();
    const buys = [{ recipient: recipient1.address, amountIn: 1n, amountOutMinimum: 1n, sqrtPriceLimitX96: 0n }];
    await expect(executor.connect(stranger).launchAndBuy(launchParams(owner), buys, { value: ethers.parseEther("0.01") + 1n }))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("rejects expired launches and zero minimum output", async function () {
    const { owner, recipient1, executor } = await deploy();
    const expired = { ...launchParams(owner), deadline: 1 };
    const protectedBuy = [{ recipient: recipient1.address, amountIn: 1n, amountOutMinimum: 1n, sqrtPriceLimitX96: 0n }];
    await expect(executor.launchAndBuy(expired, protectedBuy, { value: ethers.parseEther("0.01") + 1n }))
      .to.be.revertedWithCustomError(executor, "Expired");

    const unprotectedBuy = [{ recipient: recipient1.address, amountIn: 1n, amountOutMinimum: 0n, sqrtPriceLimitX96: 0n }];
    await expect(executor.launchAndBuy(launchParams(owner), unprotectedBuy, { value: ethers.parseEther("0.01") + 1n }))
      .to.be.revertedWithCustomError(executor, "EmptyBuy");
  });

  it("cannot renounce permanent creator control", async function () {
    const { executor } = await deploy();
    await expect(executor.renounceOwnership()).to.be.revertedWithCustomError(executor, "OwnershipRenunciationDisabled");
  });
});

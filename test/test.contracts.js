const { ethers } = require("hardhat");
const { expect } = require("chai");

function parse(amount) {
  return ethers.parseUnits(amount.toString(), 18);
}

function toNumber(bn) {
  return parseFloat(ethers.formatUnits(bn, 18));
}

describe("CPMMWithERC20Shares - Price Tests", function () {
  let owner, alice;
  let usdc, yes, no, cpmm;

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC", owner);
    usdc = await MockUSDC.deploy("Mock USDC", "USDC");
    await usdc.waitForDeployment();

    const YesToken = await ethers.getContractFactory("YesToken", owner);
    yes = await YesToken.deploy("YES Token", "YES");
    await yes.waitForDeployment();

    const NoToken = await ethers.getContractFactory("NoToken", owner);
    no = await NoToken.deploy("NO Token", "NO", owner.address);
    await no.waitForDeployment();

    const CPMM = await ethers.getContractFactory("CPMMWithERC20Shares", owner);
    cpmm = await CPMM.deploy(
      await usdc.getAddress(),
      await yes.getAddress(),
      await no.getAddress()
    );
    await cpmm.waitForDeployment();

    await yes.transferOwnership(await cpmm.getAddress());
    await no.transferOwnership(await cpmm.getAddress());
  });

  async function runSteps(amounts, expectedPrices) {
    const total = amounts.reduce((acc, val) => acc + val, 0);
    await usdc.mint(alice.address, parse(total));
    await usdc.connect(alice).approve(await cpmm.getAddress(), parse(total));

    for (let i = 0; i < amounts.length; i++) {
      await cpmm.connect(alice).buyYesForUSDC(parse(amounts[i]));
      const yesReserve = await cpmm.yesReserve();
      const price = toNumber(yesReserve) / (toNumber(yesReserve) + 250000);
      expect(price).to.be.closeTo(expectedPrices[i], 0.0002);
    }
  }

  it("Steps 0–3: Check implied prices after each USDC deposit", async function () {
    await runSteps(
      [500, 100, 100, 1],
      [0.5, 0.5901639344, 0.6621621622, 0.6628005627]
    );
  });

  it("Redeem YES after resolution", async function () {
    const amount = parse(500);
    await usdc.mint(alice.address, amount);
    await usdc.connect(alice).approve(await cpmm.getAddress(), amount);
    await cpmm.connect(alice).buyYesForUSDC(amount);

    const yesBalanceBefore = await yes.balanceOf(alice.address);
    const usdcBalanceBefore = await usdc.balanceOf(alice.address);

    await cpmm.connect(owner).resolveMarket(true);

    await yes.connect(alice).approve(await cpmm.getAddress(), yesBalanceBefore);
    await cpmm.connect(alice).redeem();

    const yesBalanceAfter = await yes.balanceOf(alice.address);
    const usdcBalanceAfter = await usdc.balanceOf(alice.address);

    expect(yesBalanceAfter).to.equal(0);
    expect(usdcBalanceAfter).to.equal(usdcBalanceBefore + yesBalanceBefore);
  });
});

// test/test.contracts.js

const { expect } = require("chai");
const { ethers } = require("hardhat");
const parseEther = (val) => ethers.parseUnits(val, 18);

describe("CPMMWithERC20Shares", function () {
  let deployer, user;
  let usdc, yes, no, oracle, market;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy("USD Coin", "USDC");

    const YesToken = await ethers.getContractFactory("YesToken");
    yes = await YesToken.deploy("YES", "YES");

    const NoToken = await ethers.getContractFactory("NoToken");
    no = await NoToken.deploy("NO", "NO");

    const MockOracle = await ethers.getContractFactory("MockOracle");
    oracle = await MockOracle.deploy();

    const CPMM = await ethers.getContractFactory("CPMMWithERC20Shares");
    market = await CPMM.deploy(
      usdc.target,
      oracle.target,
      yes.target,
      no.target
    );

    // Pre-mint 500 YES and 500 NO tokens and send to CPMM contract as initial liquidity
    await yes.mint(market.target, parseEther("500"));
    await no.mint(market.target, parseEther("500"));

    // Mint USDC to the user and approve the CPMM contract
    await usdc.mint(user.address, parseEther("10000"));
    await usdc.connect(user).approve(market.target, parseEther("10000"));
  });

  it("step 1: buy 100 YES and check price", async function () {
    const amountOut = parseEther("100");
    const amountIn = await market.getAmountIn(
      amountOut,
      parseEther("500"),
      parseEther("500")
    );
    expect(amountIn).to.be.closeTo(parseEther("125"), parseEther("0.5"));
    const yesReserveValue0 = await market.yesReserveValue();

    await market.connect(user).buyYes(amountOut);
    const yesReserve = await market.yesReserve();
    const noReserve = await market.noReserve();
    const yesReserveValue = await market.yesReserveValue();
    expect(yesReserve).to.be.closeTo(parseEther("400"), parseEther("0.0001"));
    expect(noReserve).to.be.closeTo(parseEther("500"), parseEther("0.0001"));
    expect(yesReserveValue).to.be.closeTo(parseEther("625"), parseEther("0.5"));
  });

  it("step 2: buy another 100 YES and check new price", async function () {
    const amountOut1 = parseEther("100");
    await market.connect(user).buyYes(amountOut1);
    const newYesReserve = await market.yesReserve();
    const newNoReserve = await market.noReserve();
    const yesReserveValue1 = await market.yesReserveValue();

    const amountOut2 = parseEther("100");
    const amountIn2 = await market.getAmountIn(
      amountOut2,
      yesReserveValue1,
      newYesReserve
    );
    expect(amountIn2).to.be.closeTo(
      parseEther("208.333333333333333333"),
      parseEther("0.5")
    );
    await market.connect(user).buyYes(amountOut2);
    const yesReserve = await market.yesReserve();
    const noReserve = await market.noReserve();
    const yesReserveValue = await market.yesReserveValue();
    expect(yesReserve).to.be.closeTo(parseEther("300"), parseEther("0.0001"));
    expect(noReserve).to.be.closeTo(parseEther("500"), parseEther("0.0001"));
    expect(yesReserveValue).to.be.closeTo(
      parseEther("833.333333333333333333"),
      parseEther("0.5")
    );
  });

  // not working
  it("step 3: buy $1 of YES and check price", async function () {
    await market.connect(user).buyYes(parseEther("100"));
    await market.connect(user).buyYes(parseEther("100"));
    const yesReserveBefore = await market.yesReserve();
    const noReserveBefore = await market.noReserve();
    const amountIn = parseEther("1");
    await usdc.mint(user.address, amountIn);
    await usdc.connect(user).approve(market.target, amountIn);
    const estimatedOut = parseEther("0.36");
    const estimateIn = await market.getAmountIn(
      parseEther("1"),
      yesReserveBefore,
      noReserveBefore // assuming it's YES pool purchase
    );
    // await usdc.connect(user).approve(market.target, estimatedOut);
    await market.connect(user).buyYes(estimatedOut);
    // expect(estimateIn).to.be.closeTo(amountIn, parseEther("0.6"));
    // await usdc.connect(user).approve(market.target, estimatedOut);
    // await market.connect(user).buyYes(estimatedOut);
    const yesReserveAfter = await market.yesReserve();
    const noReserveAfter = await market.noReserve();
    const yesReserveValue = await market.yesReserveValue();
    expect(yesReserveAfter).to.be.closeTo(
      parseEther("299.64"),
      parseEther("0.01")
    );
    expect(noReserveAfter).to.be.closeTo(noReserveBefore, parseEther("0.0001"));
    expect(yesReserveValue).to.be.closeTo(
      parseEther("834.3333"),
      parseEther("0.01")
    );
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

// Helper function to parse USDC amounts (6 decimals)
const usdc = (amount) => ethers.parseUnits(amount.toString(), 6);

// Helper function to parse outcome token amounts (18 decimals)
const token = (amount) => ethers.parseUnits(amount.toString(), 18);

// Helper function to format token amounts for readability in console logs
const formatToken = (amount) => ethers.formatUnits(amount, 18);

describe("PredictionMarket", function () {
  let market, usdcToken, yesToken, noToken, owner, alice;
  const initialUSDC = usdc(500);

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();

    // 1. Deploy MockUSDC
    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    usdcToken = await MockUSDCFactory.deploy();
    const usdcAddress = await usdcToken.getAddress();

    // 2. Deploy PredictionMarket (without initial funds)
    const PredictionMarketFactory = await ethers.getContractFactory(
      "PredictionMarket"
    );
    market = await PredictionMarketFactory.deploy(usdcAddress);
    const marketAddress = market.target; // Use .target for ethers v6

    // 3. Approve the newly deployed market contract to spend the owner's USDC
    await usdcToken.connect(owner).approve(marketAddress, initialUSDC);

    // 4. Initialize the market by adding liquidity
    await market.connect(owner).addInitialLiquidity(initialUSDC);

    // Get token instances
    yesToken = await ethers.getContractAt(
      "OutcomeToken",
      await market.yesToken()
    );
    noToken = await ethers.getContractAt(
      "OutcomeToken",
      await market.noToken()
    );

    // Fund Alice and approve the market to spend her USDC
    await usdcToken.mint(alice.address, usdc(1000));
    await usdcToken.connect(alice).approve(marketAddress, usdc(1000));
  });

  it("Should initialize with correct state", async function () {
    // Corresponds to spreadsheet row 6
    expect(await market.poolYes()).to.equal(token(500));
    expect(await market.poolNo()).to.equal(token(500));
    expect(await market.getYesPrice()).to.equal(token(0.5));
  });

  describe("Betting Sequence (matches spreadsheet)", function () {
    it("Step 1: Alice bets 100 USDC on Yes", async function () {
      await market.connect(alice).betYes(usdc(100));

      // The delta/tolerance value is now a string to avoid the TypeError
      const delta = token("0.000000001");

      // Corresponds to spreadsheet rows 11 & 12
      expect(await market.poolNo()).to.equal(token(600));
      expect(await market.poolYes()).to.be.closeTo(token(416.666666667), delta);

      expect(await market.getYesPrice()).to.be.closeTo(
        token(0.5901639344),
        delta
      );

      expect(await yesToken.balanceOf(alice.address)).to.be.closeTo(
        token(183.333333333),
        delta
      );
      console.log(
        `Step 1 - Alice's Yes balance: ${formatToken(
          await yesToken.balanceOf(alice.address)
        )}`
      );
    });

    it("Step 2: Alice bets another 100 USDC on Yes", async function () {
      await market.connect(alice).betYes(usdc(100)); // First bet
      await market.connect(alice).betYes(usdc(100)); // Second bet

      const delta = token("0.000000001");

      // Corresponds to spreadsheet rows 16 & 17
      expect(await market.poolNo()).to.equal(token(700));
      expect(await market.poolYes()).to.be.closeTo(token(357.142857143), delta);

      expect(await market.getYesPrice()).to.be.closeTo(
        token(0.6621621622),
        delta
      );

      expect(await yesToken.balanceOf(alice.address)).to.be.closeTo(
        token(342.857142857),
        delta
      );

      // This calculation verifies the value in cell E17
      const previousPoolYes = token(416.666666667);
      const currentPoolYes = token(357.142857143);
      const tokensFromSwap2 = previousPoolYes - currentPoolYes;
      const tokensReceivedInStep2 = token(100) + tokensFromSwap2; // 100 minted + swap amount
      expect(tokensReceivedInStep2).to.be.closeTo(token(159.523809524), delta);

      console.log(
        `Step 2 - Alice's Yes balance: ${formatToken(
          await yesToken.balanceOf(alice.address)
        )}`
      );
    });

    it("Step 3: Alice bets 1 USDC on Yes", async function () {
      await market.connect(alice).betYes(usdc(100)); // Bet 1
      await market.connect(alice).betYes(usdc(100)); // Bet 2
      await market.connect(alice).betYes(usdc(1)); // Bet 3

      const delta = token("0.0001");

      // Corresponds to spreadsheet rows 21 & 22
      expect(await market.poolNo()).to.equal(token(701));
      expect(await market.poolYes()).to.be.closeTo(token(356.633380884), delta);

      expect(await market.getYesPrice()).to.be.closeTo(
        token(0.6628005627),
        delta
      );

      expect(await yesToken.balanceOf(alice.address)).to.be.closeTo(
        token(344.366619192),
        delta
      );
      console.log(
        `Step 3 - Alice's Yes balance: ${formatToken(
          await yesToken.balanceOf(alice.address)
        )}`
      );
    });
  });

  it("Should allow redemption of winning tokens", async function () {
    // Alice makes her bets from the spreadsheet scenario
    await market.connect(alice).betYes(usdc(100));
    await market.connect(alice).betYes(usdc(100));
    await market.connect(alice).betYes(usdc(1));

    const finalYesBalance = await yesToken.balanceOf(alice.address);
    expect(finalYesBalance).to.be.gt(0);

    // Resolve market in favor of "Yes" (Enum value 1 for Yes, 2 for No)
    await market.connect(owner).resolve(1);

    // Alice approves the market contract to burn her winning tokens
    await yesToken.connect(alice).approve(market.target, finalYesBalance);

    const aliceUsdcBefore = await usdcToken.balanceOf(alice.address);

    // Alice redeems her winnings
    await market.connect(alice).redeem();

    const aliceUsdcAfter = await usdcToken.balanceOf(alice.address);

    // Each 1e18 of winning token is redeemable for 1 USDC (1e6)
    // We use BigInt division for precision with large numbers
    const expectedPayout = finalYesBalance / BigInt(10 ** 12);

    expect(aliceUsdcAfter - aliceUsdcBefore).to.equal(expectedPayout);
    expect(await yesToken.balanceOf(alice.address)).to.equal(0);

    console.log(
      `Alice redeemed ${formatToken(
        finalYesBalance
      )} Yes tokens for ${ethers.formatUnits(expectedPayout, 6)} USDC.`
    );
  });
});

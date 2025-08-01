const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarketNWayFixedModel", function () {
    let owner, alice, bob, charlie, oracle;
    let usdc;
    let market;
    const numOutcomes = 3;

    beforeEach(async function () {
        [owner, alice, bob, charlie, oracle] = await ethers.getSigners();

        // Deploy USDC
        const MintableERC20 = await ethers.getContractFactory("MintableERC20");
        usdc = await MintableERC20.deploy("USD Coin", "USDC");
        await usdc.waitForDeployment();
        const usdcAddress = await usdc.getAddress();

        // Deploy PredictionMarketNWayFixedModel
        const PredictionMarketNWayFixedModel = await ethers.getContractFactory("PredictionMarketNWayFixedModel");
        market = await PredictionMarketNWayFixedModel.deploy(
            "Who will win the election?",
            0, // ELECTION
            oracle.address,
            usdcAddress,
            numOutcomes
        );
        await market.waitForDeployment();
        const marketAddress = await market.getAddress();

        // Mint USDC for participants and approve the market
        await usdc.mint(alice.address, ethers.parseUnits("100", 6));
        await usdc.connect(alice).approve(marketAddress, ethers.parseUnits("100", 6));
        
        await usdc.mint(bob.address, ethers.parseUnits("100", 6));
        await usdc.connect(bob).approve(marketAddress, ethers.parseUnits("100", 6));

        await usdc.mint(charlie.address, ethers.parseUnits("100", 6));
        await usdc.connect(charlie).approve(marketAddress, ethers.parseUnits("100", 6));
    });

    it("should allow users to place bets on different outcomes", async function() {
        // Alice bets on outcome 0
        await market.connect(alice).bet(0);
        expect(await market.totalBetsPerOutcome(0)).to.equal(1);
        expect(await market.betsPerOutcome(0, alice.address)).to.equal(1);

        // Bob bets on outcome 1
        await market.connect(bob).bet(1);
        expect(await market.totalBetsPerOutcome(1)).to.equal(1);
        expect(await market.betsPerOutcome(1, bob.address)).to.equal(1);

        // Charlie bets on outcome 0
        await market.connect(charlie).bet(0);
        expect(await market.totalBetsPerOutcome(0)).to.equal(2);
        expect(await market.betsPerOutcome(0, charlie.address)).to.equal(1);

        const marketBalance = await usdc.balanceOf(await market.getAddress());
        expect(marketBalance).to.equal(ethers.parseUnits("3", 6));
    });

    it("should correctly distribute funds when an outcome wins", async function() {
        // Alice bets on outcome 0 (1 bet)
        await market.connect(alice).bet(0);
        // Bob bets on outcome 1 (2 bets)
        await market.connect(bob).bet(1);
        await market.connect(bob).bet(1);
        // Charlie bets on outcome 2 (3 bets)
        await market.connect(charlie).bet(2);
        await market.connect(charlie).bet(2);
        await market.connect(charlie).bet(2);

        // Total pot: 1 + 2 + 3 = 6 USDC
        // Outcome 0 bets: 1
        // Outcome 1 bets: 2
        // Outcome 2 bets: 3

        // Oracle resolves the market to outcome 1
        await market.connect(oracle).resolve(1);

        // Alice (loser) tries to claim
        await expect(market.connect(alice).claim()).to.be.revertedWith("No winnings to claim");
        // Charlie (loser) tries to claim
        await expect(market.connect(charlie).claim()).to.be.revertedWith("No winnings to claim");

        // Bob (winner) claims his winnings
        const bobBalanceBefore = await usdc.balanceOf(bob.address);
        await market.connect(bob).claim();
        const bobBalanceAfter = await usdc.balanceOf(bob.address);

        // Losing pot = 1 (from Alice) + 3 (from Charlie) = 4 USDC
        // Bob's share of profit = (4 USDC * 2 of his bets) / 2 total winning bets = 4 USDC
        // Bob gets his 2 USDC stake back + 4 USDC profit = 6 USDC
        const expectedWinnings = ethers.parseUnits("6", 6);
        expect(bobBalanceAfter - bobBalanceBefore).to.equal(expectedWinnings);
        
        // Bob's bets should be reset
        expect(await market.betsPerOutcome(1, bob.address)).to.equal(0);
    });

    it("should handle a case where the winner is the only bettor", async function() {
        // Alice bets on outcome 0 (2 bets)
        await market.connect(alice).bet(0);
        await market.connect(alice).bet(0);

        // Oracle resolves the market to outcome 0
        await market.connect(oracle).resolve(0);

        // Alice claims
        const aliceBalanceBefore = await usdc.balanceOf(alice.address);
        await market.connect(alice).claim();
        const aliceBalanceAfter = await usdc.balanceOf(alice.address);

        // Profit is 0, she gets her stake back
        const expectedWinnings = ethers.parseUnits("2", 6);
        expect(aliceBalanceAfter - aliceBalanceBefore).to.equal(expectedWinnings);
    });
});

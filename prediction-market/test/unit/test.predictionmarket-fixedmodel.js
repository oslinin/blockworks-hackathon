const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarketFixedModel", function () {
    let owner, alice, bob, oracle;
    let usdc;
    let market;

    beforeEach(async function () {
        [owner, alice, bob, oracle] = await ethers.getSigners();

        // Deploy USDC
        const MintableERC20 = await ethers.getContractFactory("MintableERC20");
        usdc = await MintableERC20.deploy("USD Coin", "USDC");
        await usdc.waitForDeployment();
        const usdcAddress = await usdc.getAddress();

        // Deploy PredictionMarketFixedModel
        const PredictionMarketFixedModel = await ethers.getContractFactory("PredictionMarketFixedModel");
        market = await PredictionMarketFixedModel.deploy(
            "Will ETH reach $5000 by end of year?",
            2, // CRYPTO
            oracle.address,
            usdcAddress
        );
        await market.waitForDeployment();
        const marketAddress = await market.getAddress();

        // Mint USDC for Alice and Bob and approve the market
        await usdc.mint(alice.address, ethers.parseUnits("100", 6));
        await usdc.connect(alice).approve(marketAddress, ethers.parseUnits("100", 6));
        
        await usdc.mint(bob.address, ethers.parseUnits("100", 6));
        await usdc.connect(bob).approve(marketAddress, ethers.parseUnits("100", 6));
    });

    it("should allow users to place bets", async function() {
        // Alice bets YES
        await market.connect(alice).bet(true);
        expect(await market.totalYesBets()).to.equal(1);
        expect(await market.yesBets(alice.address)).to.equal(1);
        expect(await usdc.balanceOf(await market.getAddress())).to.equal(ethers.parseUnits("1", 6));

        // Bob bets NO
        await market.connect(bob).bet(false);
        expect(await market.totalNoBets()).to.equal(1);
        expect(await market.noBets(bob.address)).to.equal(1);
        expect(await usdc.balanceOf(await market.getAddress())).to.equal(ethers.parseUnits("2", 6));
        
        // Alice bets YES again
        await market.connect(alice).bet(true);
        expect(await market.totalYesBets()).to.equal(2);
        expect(await market.yesBets(alice.address)).to.equal(2);
        expect(await usdc.balanceOf(await market.getAddress())).to.equal(ethers.parseUnits("3", 6));
    });

    it("should not allow actions on an unresolved market", async function() {
        await expect(market.connect(alice).claim()).to.be.revertedWith("Market is not resolved yet");
    });

    it("should not allow non-oracle to resolve", async function() {
        await expect(market.connect(alice).resolve(true)).to.be.revertedWith("Only oracle can resolve");
    });

    it("should correctly distribute funds when YES wins", async function() {
        // Alice bets YES 2 times (2 USDC)
        await market.connect(alice).bet(true);
        await market.connect(alice).bet(true);

        // Bob bets NO 3 times (3 USDC)
        await market.connect(bob).bet(false);
        await market.connect(bob).bet(false);
        await market.connect(bob).bet(false);

        // Total pot is 5 USDC. 2 YES, 3 NO.
        expect(await market.totalYesBets()).to.equal(2);
        expect(await market.totalNoBets()).to.equal(3);

        // Oracle resolves the market to YES
        await market.connect(oracle).resolve(true);
        expect(await market.resolved()).to.be.true;
        expect(await market.outcome()).to.be.true;

        // Bob (loser) tries to claim
        await expect(market.connect(bob).claim()).to.be.revertedWith("No winnings to claim");

        // Alice (winner) claims her winnings
        const aliceBalanceBefore = await usdc.balanceOf(alice.address);
        await market.connect(alice).claim();
        const aliceBalanceAfter = await usdc.balanceOf(alice.address);

        // Alice's profit = (3 USDC from NO pot * 2 of her bets) / 2 total YES bets = 3 USDC
        // Alice gets her 2 USDC stake back + 3 USDC profit = 5 USDC
        const expectedWinnings = ethers.parseUnits("5", 6);
        expect(aliceBalanceAfter - aliceBalanceBefore).to.equal(expectedWinnings);
        
        // Alice's bets should be reset
        expect(await market.yesBets(alice.address)).to.equal(0);
    });

    it("should correctly distribute funds when NO wins", async function() {
        // Alice bets YES 2 times (2 USDC)
        await market.connect(alice).bet(true);
        await market.connect(alice).bet(true);

        // Bob bets NO 3 times (3 USDC)
        await market.connect(bob).bet(false);
        await market.connect(bob).bet(false);
        await market.connect(bob).bet(false);

        // Oracle resolves the market to NO
        await market.connect(oracle).resolve(false);

        // Alice (loser) tries to claim
        await expect(market.connect(alice).claim()).to.be.revertedWith("No winnings to claim");

        // Bob (winner) claims his winnings
        const bobBalanceBefore = await usdc.balanceOf(bob.address);
        await market.connect(bob).claim();
        const bobBalanceAfter = await usdc.balanceOf(bob.address);

        // Bob's profit = (2 USDC from YES pot * 3 of his bets) / 3 total NO bets = 2 USDC
        // Bob gets his 3 USDC stake back + 2 USDC profit = 5 USDC
        const expectedWinnings = ethers.parseUnits("5", 6);
        expect(bobBalanceAfter - bobBalanceBefore).to.equal(expectedWinnings);
        
        // Bob's bets should be reset
        expect(await market.noBets(bob.address)).to.equal(0);
    });
    
    it("should handle a case with one side having zero bets", async function() {
        // Alice bets YES 2 times
        await market.connect(alice).bet(true);
        await market.connect(alice).bet(true);

        // Oracle resolves the market to YES
        await market.connect(oracle).resolve(true);

        // Alice claims
        const aliceBalanceBefore = await usdc.balanceOf(alice.address);
        await market.connect(alice).claim();
        const aliceBalanceAfter = await usdc.balanceOf(alice.address);

        // Profit is 0, she gets her stake back
        const expectedWinnings = ethers.parseUnits("2", 6);
        expect(aliceBalanceAfter - aliceBalanceBefore).to.equal(expectedWinnings);
    });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
    let PredictionMarket;
    let usdc;
    let owner;
    let alice;
    let bob;
    let initialLiquidity = ethers.parseUnits("500", 6); // 500 USDC
    const CFMM_K = 250000 * 1e12;

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners();

        // Deploy a mock USDC token
        const MockUSDC = await ethers.getContractFactory("MintableERC20");
        usdc = await MockUSDC.deploy("Mock USDC", "USDC");
        await usdc.waitForDeployment();

        // Mint some USDC for owner and alice
        await usdc.mint(owner.address, ethers.parseUnits("10000", 6));
        await usdc.mint(alice.address, ethers.parseUnits("10000", 6));
        await usdc.mint(bob.address, ethers.parseUnits("10000", 6));

        // Deploy PredictionMarket
        PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        // Pass the owner.address as the initialOwner
        predictionMarket = await PredictionMarket.deploy(usdc.target, "Will BTC hit $100k by 2025?", 2, owner.address); // Category 2 for Crypto
        await predictionMarket.waitForDeployment();

        // Approve USDC for the prediction market contract
        await usdc.connect(owner).approve(predictionMarket.target, initialLiquidity);
        await usdc.connect(alice).approve(predictionMarket.target, ethers.parseUnits("1000", 6));
        await usdc.connect(bob).approve(predictionMarket.target, ethers.parseUnits("1000", 6));

        // Initialize the market
        await predictionMarket.connect(owner).initializeMarket(initialLiquidity);
    });

    describe("Initialization", function () {
        it("should set the correct USDC address and question", async function () {
            expect(await predictionMarket.USDC()).to.equal(usdc.target);
            expect(await predictionMarket.name()).to.equal("Will BTC hit $100k by 2025?");
        });

        it("should initialize pools with correct liquidity", async function () {
            expect(await predictionMarket.yesPool()).to.equal(initialLiquidity);
            expect(await predictionMarket.noPool()).to.equal(initialLiquidity);
        });

        it("should set the market category", async function () {
            expect(await predictionMarket.marketCategory()).to.equal(2); // Crypto
        });

        it("should set resolved to false", async function () {
            expect(await predictionMarket.resolved()).to.be.false;
        });
    });

    describe("Betting", function () {
        it("Alice bets 100 USDC on Yes", async function () {
            const usdcAmount = ethers.parseUnits("100", 6);
            const initialAliceUSDCBalance = await usdc.balanceOf(alice.address);

            await predictionMarket.connect(alice).placeBet(usdcAmount, true); // Bet on Yes

            // Check Alice's USDC balance
            expect(await usdc.balanceOf(alice.address)).to.equal(initialAliceUSDCBalance - usdcAmount);

            // Check Alice's Yes token balance
            const yesToken = await ethers.getContractAt("MintableERC20", await predictionMarket.yesToken());
            expect(await yesToken.balanceOf(alice.address)).to.equal(usdcAmount);

            // Check pool balances after bet
            // Initial: yesPool = 500, noPool = 500, k = 250000
            // Alice bets 100 USDC on Yes.
            // User receives 100 Yes tokens.
            // yesPool increases by 100 to 600.
            // noPool decreases to maintain k: newNoPool = 250000 / 600 = 416.666666...
            // noTokensToBurn = 500 - 416.666666... = 83.333333...

            expect(await predictionMarket.yesPool()).to.equal(ethers.parseUnits("600", 6));
            // Using a tolerance for floating point comparison
            const expectedNoPool = ethers.parseUnits("416.666666", 6);
            const actualNoPool = await predictionMarket.noPool();
            expect(actualNoPool).to.be.closeTo(expectedNoPool, ethers.parseUnits("0.000001", 6));

            // Check probability after first bet
            // yesPool = 600, noPool = 416.666666
            // totalPool = 1016.666666
            // yesProbability = (600 / 1016.666666) * 10000 = 5901.639...
            const [yesProb, noProb] = await predictionMarket.getProbability();
            expect(yesProb).to.be.closeTo(5902, 1); // Allowing for small rounding differences
            expect(noProb).to.be.closeTo(4098, 1);
        });

        it("Alice places another bet on Yes", async function () {
            // First bet
            await predictionMarket.connect(alice).placeBet(ethers.parseUnits("100", 6), true);

            // Second bet: Alice bets 100 USDC on Yes again
            const usdcAmount = ethers.parseUnits("100", 6);
            const initialAliceUSDCBalance = await usdc.balanceOf(alice.address);
            const initialAliceYesTokenBalance = await (await ethers.getContractAt("ERC20", await predictionMarket.yesToken())).balanceOf(alice.address);

            await predictionMarket.connect(alice).placeBet(usdcAmount, true);

            // Check Alice's USDC balance
            expect(await usdc.balanceOf(alice.address)).to.equal(initialAliceUSDCBalance - usdcAmount);

            // Check Alice's Yes token balance
            const yesToken = await ethers.getContractAt("MintableERC20", await predictionMarket.yesToken());
            expect(await yesToken.balanceOf(alice.address)).to.equal(initialAliceYesTokenBalance + usdcAmount);

            // Check pool balances after second bet
            // Before second bet: yesPool = 600, noPool = 416.666666
            // Alice bets 100 USDC on Yes.
            // User receives 100 Yes tokens.
            // yesPool increases by 100 to 700.
            // noPool decreases to maintain k: newNoPool = 250000 / 700 = 357.142857...
            // noTokensToBurn = 416.666666 - 357.142857 = 59.523809...

            expect(await predictionMarket.yesPool()).to.equal(ethers.parseUnits("700", 6));
            const expectedNoPool = ethers.parseUnits("357.142857", 6);
            const actualNoPool = await predictionMarket.noPool();
            expect(actualNoPool).to.be.closeTo(expectedNoPool, ethers.parseUnits("0.000001", 6));

            // Check probability after second bet
            // yesPool = 700, noPool = 357.142857
            // totalPool = 1057.142857
            // yesProbability = (700 / 1057.142857) * 10000 = 6621.95...
            const [yesProb, noProb] = await predictionMarket.getProbability();
            expect(yesProb).to.be.closeTo(6622, 1);
            expect(noProb).to.be.closeTo(3378, 1);
        });

        it("should allow betting on No", async function () {
            const usdcAmount = ethers.parseUnits("100", 6);
            const initialAliceUSDCBalance = await usdc.balanceOf(alice.address);

            await predictionMarket.connect(alice).placeBet(usdcAmount, false); // Bet on No

            // Check Alice's USDC balance
            expect(await usdc.balanceOf(alice.address)).to.equal(initialAliceUSDCBalance - usdcAmount);

            // Check Alice's No token balance
            const noToken = await ethers.getContractAt("MintableERC20", await predictionMarket.noToken());
            expect(await noToken.balanceOf(alice.address)).to.equal(usdcAmount);

            // Check pool balances after bet
            // Initial: yesPool = 500, noPool = 500, k = 250000
            // Alice bets 100 USDC on No.
            // User receives 100 No tokens.
            // noPool increases by 100 to 600.
            // yesPool decreases to maintain k: newYesPool = 250000 / 600 = 416.666666...
            // yesTokensToBurn = 500 - 416.666666... = 83.333333...

            expect(await predictionMarket.noPool()).to.equal(ethers.parseUnits("600", 6));
            const expectedYesPool = ethers.parseUnits("416.666666", 6);
            const actualYesPool = await predictionMarket.yesPool();
            expect(actualYesPool).to.be.closeTo(expectedYesPool, ethers.parseUnits("0.000001", 6));

            // Check probability after bet
            const [yesProb, noProb] = await predictionMarket.getProbability();
            expect(yesProb).to.be.closeTo(4098, 1);
            expect(noProb).to.be.closeTo(5902, 1);
        });

        it("should emit a BetPlaced event", async function () {
            const usdcAmount = ethers.parseUnits("50", 6);
            await expect(predictionMarket.connect(alice).placeBet(usdcAmount, true))
                .to.emit(predictionMarket, "BetPlaced")
                .withArgs(alice.address, usdcAmount, 0, 2); // 2 for Crypto category
        });
    });

    describe("Probability Calculation", function () {
        it("should return 0.5 probability initially", async function () {
            const [yesProb, noProb] = await predictionMarket.getProbability();
            expect(yesProb).to.equal(5000);
            expect(noProb).to.equal(5000);
        });

        it("should reflect probability after a Yes bet", async function () {
            await predictionMarket.connect(alice).placeBet(ethers.parseUnits("100", 6), true);
            const [yesProb, noProb] = await predictionMarket.getProbability();
            expect(yesProb).to.be.closeTo(5902, 1);
            expect(noProb).to.be.closeTo(4098, 1);
        });

        it("should reflect probability after a No bet", async function () {
            await predictionMarket.connect(alice).placeBet(ethers.parseUnits("100", 6), false);
            const [yesProb, noProb] = await predictionMarket.getProbability();
            expect(yesProb).to.be.closeTo(4098, 1);
            expect(noProb).to.be.closeTo(5902, 1);
        });
    });

    describe("Resolution and Claiming", function () {
        it("should allow owner to resolve the market", async function () {
            await expect(predictionMarket.connect(owner).resolve(1))
                .to.emit(predictionMarket, "MarketResolved")
                .withArgs(1);
            expect(await predictionMarket.resolved()).to.be.true;
            expect(await predictionMarket.winningOutcome()).to.equal(1);
        });

        it("should not allow non-owner to resolve the market", async function () {
            await expect(predictionMarket.connect(alice).resolve(1)).to.be.revertedWithCustomError(predictionMarket, "OwnableUnauthorizedAccount");
        });

        it("should allow users to claim winnings for Yes outcome", async function () {
            const usdcAmount = ethers.parseUnits("100", 6);
            await predictionMarket.connect(alice).placeBet(usdcAmount, true); // Alice bets on Yes

            await predictionMarket.connect(owner).resolve(1); // Yes wins

            const initialAliceUSDCBalance = await usdc.balanceOf(alice.address);
            const yesToken = await ethers.getContractAt("MintableERC20", await predictionMarket.yesToken());
            const aliceYesTokens = await yesToken.balanceOf(alice.address);

            await predictionMarket.connect(alice).claimWinnings();

            expect(await usdc.balanceOf(alice.address)).to.equal(initialAliceUSDCBalance + aliceYesTokens);
            expect(await yesToken.balanceOf(alice.address)).to.equal(0);
        });

        it("should allow users to claim winnings for No outcome", async function () {
            const usdcAmount = ethers.parseUnits("100", 6);
            await predictionMarket.connect(alice).placeBet(usdcAmount, false); // Alice bets on No

            await predictionMarket.connect(owner).resolve(0); // No wins

            const initialAliceUSDCBalance = await usdc.balanceOf(alice.address);
            const noToken = await ethers.getContractAt("MintableERC20", await predictionMarket.noToken());
            const aliceNoTokens = await noToken.balanceOf(alice.address);

            await predictionMarket.connect(alice).claimWinnings();

            expect(await usdc.balanceOf(alice.address)).to.equal(initialAliceUSDCBalance + aliceNoTokens);
            expect(await noToken.balanceOf(alice.address)).to.equal(0);
        });

        it("should not allow claiming before resolution", async function () {
            const usdcAmount = ethers.parseUnits("100", 6);
            await predictionMarket.connect(alice).placeBet(usdcAmount, true);

            await expect(predictionMarket.connect(alice).claimWinnings()).to.be.revertedWith("Market not yet resolved");
        });

        it("should not allow claiming if no winning tokens", async function () {
            const usdcAmount = ethers.parseUnits("100", 6);
            await predictionMarket.connect(alice).placeBet(usdcAmount, true); // Alice bets on Yes

            await predictionMarket.connect(owner).resolve(0); // No wins

            await expect(predictionMarket.connect(alice).claimWinnings()).to.be.revertedWith("No winning tokens to claim");
        });
    });
});
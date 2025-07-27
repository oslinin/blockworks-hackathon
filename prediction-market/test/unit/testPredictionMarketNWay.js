const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe("PredictionMarketNWay", function () {
    let owner, alice, oracle;
    let usdc, market;
    const OUTCOMES = ["A", "B", "C", "D"];
    const SYMBOLS = ["A-TKN", "B-TKN", "C-TKN", "D-TKN"];
    const INITIAL_LIQUIDITY = ethers.parseUnits("1000", 6);

    beforeEach(async function () {
        [owner, alice, oracle] = await ethers.getSigners();

        // Deploy USDC
        const MintableERC20 = await ethers.getContractFactory("MintableERC20");
        usdc = await MintableERC20.deploy("USD Coin", "USDC");
        await usdc.waitForDeployment();

        // Deploy PredictionMarketNWay
        const PredictionMarketNWay = await ethers.getContractFactory("PredictionMarketNWay");
        market = await PredictionMarketNWay.deploy(
            "Who will win the election?",
            0, // ELECTION
            oracle.address,
            await usdc.getAddress(),
            OUTCOMES,
            SYMBOLS,
            INITIAL_LIQUIDITY
        );
        await market.waitForDeployment();

        // Mint USDC for Alice and approve the market
        await usdc.mint(alice.address, ethers.parseUnits("10000", 6));
        await usdc.connect(alice).approve(await market.getAddress(), ethers.parseUnits("10000", 6));
    });

    it("should have correct initial state", async function() {
        const marketAddress = await market.getAddress();
        for (let i = 0; i < OUTCOMES.length; i++) {
            const token = await ethers.getContractAt("MintableERC20", await market.outcomeTokens(i));
            expect(await token.balanceOf(marketAddress)).to.equal(INITIAL_LIQUIDITY);
        }
        const probabilities = await market.getProbabilities();
        expect(probabilities.length).to.equal(OUTCOMES.length);
        for (const p of probabilities) {
            expect(Number(ethers.formatUnits(p, 18))).to.be.closeTo(0.25, 0.001);
        }
    });

    it("should handle bets correctly", async function () {
        const betAmount = ethers.parseUnits("100", 6);
        const outcomeIndex = 0; // Bet on A

        await market.connect(alice).bet(betAmount, outcomeIndex);

        const tokens = [];
        for (let i = 0; i < OUTCOMES.length; i++) {
            tokens.push(await ethers.getContractAt("MintableERC20", await market.outcomeTokens(i)));
        }

        const aliceBalance = await tokens[outcomeIndex].balanceOf(alice.address);
        expect(aliceBalance).to.equal(betAmount);

        const marketAddress = await market.getAddress();
        const marketBalances = [];
        for (const token of tokens) {
            marketBalances.push(await token.balanceOf(marketAddress));
        }

        const initialBalance = INITIAL_LIQUIDITY;
        expect(marketBalances[0]).to.equal(initialBalance.toString());
        for (let i = 1; i < OUTCOMES.length; i++) {
            expect(marketBalances[i]).to.equal(initialBalance + betAmount);
        }
    });

    it("should resolve the market", async function () {
        const winningOutcome = 2; // C wins
        await market.connect(oracle).resolve(winningOutcome);
        expect(await market.resolved()).to.be.true;
        expect(await market.winningOutcome()).to.equal(winningOutcome);
    });
}) : describe.skip;

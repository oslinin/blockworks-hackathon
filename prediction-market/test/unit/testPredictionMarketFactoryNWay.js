const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe("PredictionMarketFactoryNWay", function () {
    let owner, oracle;
    let usdc, factory;
    const OUTCOMES = ["X", "Y", "Z"];
    const SYMBOLS = ["X-TKN", "Y-TKN", "Z-TKN"];
    const INITIAL_LIQUIDITY = ethers.parseUnits("500", 6);

    beforeEach(async function () {
        [owner, oracle] = await ethers.getSigners();

        // Deploy USDC
        const MintableERC20 = await ethers.getContractFactory("MintableERC20");
        usdc = await MintableERC20.deploy("USD Coin", "USDC");
        await usdc.waitForDeployment();

        // Deploy Factory
        const PredictionMarketFactoryNWay = await ethers.getContractFactory("PredictionMarketFactoryNWay");
        factory = await PredictionMarketFactoryNWay.deploy();
        await factory.waitForDeployment();
    });

    it("should create a new N-way prediction market", async function () {
        const usdcAddress = await usdc.getAddress();
        await expect(factory.createMarket(
            "Which project will win the hackathon?",
            3, // OTHER
            oracle.address,
            usdcAddress,
            OUTCOMES,
            SYMBOLS,
            INITIAL_LIQUIDITY
        )).to.emit(factory, "MarketCreated");

        const markets = await factory.getAllMarkets();
        expect(markets.length).to.equal(1);
    });

    it("should get N-way markets by category", async function () {
        const usdcAddress = await usdc.getAddress();
        await factory.createMarket(
            "Who will win the next election?",
            0, // ELECTION
            oracle.address,
            usdcAddress,
            ["Candidate A", "Candidate B"],
            ["A-TKN", "B-TKN"],
            INITIAL_LIQUIDITY
        );

        await factory.createMarket(
            "Which crypto will perform best?",
            2, // CRYPTO
            oracle.address,
            usdcAddress,
            ["BTC", "ETH", "SOL"],
            ["BTC-TKN", "ETH-TKN", "SOL-TKN"],
            INITIAL_LIQUIDITY
        );

        const electionMarkets = await factory.getMarketsByCategory(0); // ELECTION
        expect(electionMarkets.length).to.equal(1);

        const cryptoMarkets = await factory.getMarketsByCategory(2); // CRYPTO
        expect(cryptoMarkets.length).to.equal(1);

        const sportsMarkets = await factory.getMarketsByCategory(1); // SPORTS
        expect(sportsMarkets.length).to.equal(0);
    });
}) : describe.skip;

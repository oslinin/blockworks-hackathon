const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe("PredictionMarketFactory", function () {
    let owner, alice, oracle;
    let usdc;
    let factory;

    beforeEach(async function () {
        [owner, alice, oracle] = await ethers.getSigners();

        const MintableERC20 = await ethers.getContractFactory("MintableERC20");
        usdc = await MintableERC20.deploy("USD Coin", "USDC");
        await usdc.waitForDeployment();

        const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarketFactory");
        factory = await PredictionMarketFactory.deploy();
        await factory.waitForDeployment();
    });

    it("should create a new prediction market", async function () {
        const usdcAddress = await usdc.getAddress();
        await expect(factory.createMarket(
            "Will BTC reach $100k by end of year?",
            1, // SPORTS
            oracle.address,
            usdcAddress,
            "Yes Token",
            "YES",
            "No Token",
            "NO",
            ethers.parseUnits("500", 18)
        )).to.emit(factory, "MarketCreated");

        const markets = await factory.getAllMarkets();
        expect(markets.length).to.equal(1);
    });

    it("should get markets by category", async function () {
        const usdcAddress = await usdc.getAddress();
        await factory.createMarket(
            "Will ETH reach $5k by end of year?",
            2, // CRYPTO
            oracle.address,
            usdcAddress,
            "Yes Token",
            "YES",
            "No Token",
            "NO",
            ethers.parseUnits("500", 18)
        );

        await factory.createMarket(
            "Will the Lakers win the championship?",
            1, // SPORTS
            oracle.address,
            usdcAddress,
            "Yes Token 2",
            "YES2",
            "No Token 2",
            "NO2",
            ethers.parseUnits("500", 18)
        );

        const cryptoMarkets = await factory.getMarketsByCategory(2); // CRYPTO
        expect(cryptoMarkets.length).to.equal(1);

        const sportsMarkets = await factory.getMarketsByCategory(1); // SPORTS
        expect(sportsMarkets.length).to.equal(1);

        const electionMarkets = await factory.getMarketsByCategory(0); // ELECTION
        expect(electionMarkets.length).to.equal(0);
    });
}) : describe.skip;
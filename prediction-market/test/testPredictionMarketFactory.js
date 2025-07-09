const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarketFactory", function () {
    let PredictionMarketFactory;
    let predictionMarketFactory;
    let owner;
    let addr1;
    let usdc;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        // Deploy a mock USDC token
        const MockUSDC = await ethers.getContractFactory("MintableERC20");
        usdc = await MockUSDC.deploy("Mock USDC", "USDC");
        await usdc.waitForDeployment();

        PredictionMarketFactory = await ethers.getContractFactory("PredictionMarketFactory");
        predictionMarketFactory = await PredictionMarketFactory.deploy();
        await predictionMarketFactory.waitForDeployment();
    });

    describe("Market Creation", function () {
        it("should create a new prediction market", async function () {
            const question = "Will ETH hit $5k by 2025?";
            const category = 2; // Crypto

            await expect(predictionMarketFactory.createMarket(usdc.target, question, category))
                .to.emit(predictionMarketFactory, "MarketCreated");

            const allMarkets = await predictionMarketFactory.getAllMarkets();
            expect(allMarkets.length).to.equal(1);

            const cryptoMarkets = await predictionMarketFactory.getMarketsByCategory(category);
            expect(cryptoMarkets.length).to.equal(1);
            expect(cryptoMarkets[0]).to.equal(allMarkets[0]);

            // Verify the deployed market's properties
            const newMarket = await ethers.getContractAt("PredictionMarket", allMarkets[0]);
            expect(await newMarket.USDC()).to.equal(usdc.target);
            expect(await newMarket.name()).to.equal(question);
            expect(await newMarket.marketCategory()).to.equal(category);
        });

        it("should create multiple prediction markets", async function () {
            await predictionMarketFactory.createMarket(usdc.target, "Q1", 0); // Sports
            await predictionMarketFactory.createMarket(usdc.target, "Q2", 1); // Elections
            await predictionMarketFactory.createMarket(usdc.target, "Q3", 2); // Crypto

            expect((await predictionMarketFactory.getAllMarkets()).length).to.equal(3);
            expect((await predictionMarketFactory.getMarketsByCategory(0)).length).to.equal(1);
            expect((await predictionMarketFactory.getMarketsByCategory(1)).length).to.equal(1);
            expect((await predictionMarketFactory.getMarketsByCategory(2)).length).to.equal(1);
        });
    });

    describe("Market Retrieval", function () {
        it("should return all markets", async function () {
            await predictionMarketFactory.createMarket(usdc.target, "Q1", 0); // Sports
            await predictionMarketFactory.createMarket(usdc.target, "Q2", 1); // Elections
            await predictionMarketFactory.createMarket(usdc.target, "Q3", 2); // Crypto
            const allMarkets = await predictionMarketFactory.getAllMarkets();
            expect(allMarkets.length).to.equal(3);
        });

        it("should return markets by category", async function () {
            await predictionMarketFactory.createMarket(usdc.target, "Q1", 0); // Sports
            await predictionMarketFactory.createMarket(usdc.target, "Q2", 1); // Elections
            await predictionMarketFactory.createMarket(usdc.target, "Q3", 2); // Crypto

            const sportsMarkets = await predictionMarketFactory.getMarketsByCategory(0);
            expect(sportsMarkets.length).to.equal(1);

            const electionMarkets = await predictionMarketFactory.getMarketsByCategory(1);
            expect(electionMarkets.length).to.equal(1);

            const cryptoMarkets = await predictionMarketFactory.getMarketsByCategory(2);
            expect(cryptoMarkets.length).to.equal(1);
        });

        it("should return an empty array if no markets in category", async function () {
            // No markets created for category 0 (Sports) in this specific test
            const emptyCategory = 0; 
            const markets = await predictionMarketFactory.getMarketsByCategory(emptyCategory);
            expect(markets).to.be.an('array').that.is.empty;
        });
    });

    describe("getAllBets", function () {
        it("should return all market addresses", async function () {
            await predictionMarketFactory.createMarket(usdc.target, "Q1", 0); // Sports
            await predictionMarketFactory.createMarket(usdc.target, "Q2", 1); // Elections

            const allBets = await predictionMarketFactory.getAllBets();
            const allMarkets = await predictionMarketFactory.getAllMarkets();

            expect(allBets.length).to.equal(allMarkets.length);
            for (let i = 0; i < allMarkets.length; i++) {
                expect(allBets).to.include(allMarkets[i]);
            }
        });

        it("should return an empty array if no markets exist", async function () {
            const allBets = await predictionMarketFactory.getAllBets();
            expect(allBets.length).to.equal(0);
        });
    });
});

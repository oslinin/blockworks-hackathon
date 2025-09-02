const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarketFactoryFixedModel", function () {
    let owner, oracle;
    let usdc;
    let factory;

    beforeEach(async function () {
        [owner, oracle] = await ethers.getSigners();

        const MintableERC20 = await ethers.getContractFactory("MintableERC20");
        usdc = await MintableERC20.deploy("USD Coin", "USDC");
        await usdc.waitForDeployment();

        const PredictionMarketFactoryFixedModel = await ethers.getContractFactory("PredictionMarketFactoryFixedModel");
        factory = await PredictionMarketFactoryFixedModel.deploy();
        await factory.waitForDeployment();
    });

    it("should create a new Fixed Model prediction market", async function () {
        const usdcAddress = await usdc.getAddress();
        await expect(factory.createMarket(
            "Will the ETH merge be delayed?",
            2, // CRYPTO
            oracle.address,
            usdcAddress
        )).to.emit(factory, "MarketCreatedFixedModel");

        const fixedMarkets = await factory.getAllFixedModelMarkets();
        expect(fixedMarkets.length).to.equal(1);
    });
});

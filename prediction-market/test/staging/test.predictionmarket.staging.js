const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket Staging", function () {
    let owner, alice, oracle;
    let usdc, market, factory;

    beforeEach(async function () {
        [owner, alice, oracle] = await ethers.getSigners();

        // USDC contract on mainnet
        const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        usdc = await ethers.getContractAt("IERC20", usdcAddress);

        // Impersonate a USDC whale
        const usdcWhaleAddress = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
        const usdcWhale = await ethers.getImpersonatedSigner(usdcWhaleAddress);

        // Transfer USDC from the whale to Alice
        const usdcAmount = ethers.parseUnits("1000", 6);
        await usdc.connect(usdcWhale).transfer(alice.address, usdcAmount);

        // Deploy Factory
        const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarketFactory");
        factory = await PredictionMarketFactory.deploy();
        await factory.waitForDeployment();

        // The owner creates a market
        const marketAddress = await factory.connect(owner).createMarket.staticCall(
            "Will ETH reach $5000 by end of year?",
            2, // CRYPTO
            oracle.address,
            usdcAddress,
            "Yes Token", "YES", "No Token", "NO"
        );

        await factory.createMarket(
            "Will ETH reach $5000 by end of year?",
            2, // CRYPTO
            oracle.address,
            usdcAddress,
            "Yes Token", "YES", "No Token", "NO"
        );

        // Attach to the created contracts
        market = await ethers.getContractAt("PredictionMarket", marketAddress);
    });

    it("should allow a user to bet with USDC", async function () {
        const usdcAmount = ethers.parseUnits("100", 6);

        // Approve the market to spend Alice's USDC
        await usdc.connect(alice).approve(await market.getAddress(), usdcAmount);

        // Alice bets 100 USDC on "yes"
        await market.connect(alice).bet(usdcAmount, true);

        // Check Alice's balance of Yes tokens
        const yesTokenAddress = await market.yesToken();
        const yesToken = await ethers.getContractAt("MintableERC20", yesTokenAddress);
        const aliceYesBalance = await yesToken.balanceOf(alice.address);
        expect(aliceYesBalance).to.be.gt(0);
    });
});

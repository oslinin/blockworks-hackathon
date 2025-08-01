const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe("PredictionMarket", function () {
    let owner, alice, oracle;
    let usdc, yesToken, noToken;
    let market, factory;

    beforeEach(async function () {
        [owner, alice, oracle] = await ethers.getSigners();

        // Deploy USDC
        const MintableERC20 = await ethers.getContractFactory("MintableERC20");
        usdc = await MintableERC20.deploy("USD Coin", "USDC");
        await usdc.waitForDeployment();

        // Deploy Factory
        const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarketFactory");
        factory = await PredictionMarketFactory.deploy();
        await factory.waitForDeployment();

        // The owner creates a market. This is a common and elegant pattern for testing contract factories.
        // It solves the problem of needing the new contract's address immediately after creation.
        
        // Why not just create the market and then get its address from the transaction receipt?
        // While possible, that approach is more complex. It would require:
        //   1. Executing the transaction: `const tx = await factory.createMarket(...)`
        //   2. Waiting for the receipt: `const receipt = await tx.wait()`
        //   3. Manually searching the transaction logs for the 'MarketCreated' event.
        //   4. Parsing the event to extract the address from its arguments.
        // This is verbose and less direct.

        // The staticCall pattern is much cleaner:

        // 1. Static Call (The "Dry Run"): 
        // We use `staticCall` to simulate the transaction without actually sending it to the blockchain.
        // It's a read-only operation that doesn't consume gas or change state.
        // Its purpose here is to capture the return value of the function—the predicted address of the new market.
        const marketAddress = await factory.connect(owner).createMarket.staticCall(
            "Will ETH reach $5000 by end of year?",
            2, // CRYPTO
            oracle.address,
            await usdc.getAddress(),
            "Yes Token", "YES", "No Token", "NO",
            ethers.parseUnits("500", 18)
        );

        // 2. Actual Transaction (The "Real Deal"): 
        // Now that we have the predicted address, we execute the real transaction.
        // This pays the gas, changes the blockchain state, and deploys the contract at that known address.
        await factory.createMarket(
            "Will ETH reach $5000 by end of year?",
            2, // CRYPTO
            oracle.address,
            await usdc.getAddress(),
            "Yes Token", "YES", "No Token", "NO",
            ethers.parseUnits("500", 18)
        );

        // Attach to the created contracts
        market = await ethers.getContractAt("PredictionMarket", marketAddress);
        const yesTokenAddress = await market.yesToken();
        const noTokenAddress = await market.noToken();
        yesToken = await ethers.getContractAt("MintableERC20", yesTokenAddress);
        noToken = await ethers.getContractAt("MintableERC20", noTokenAddress);

        // Mint USDC for Alice and approve the market
        await usdc.mint(alice.address, ethers.parseUnits("10000", 6));
        await usdc.connect(alice).approve(await market.getAddress(), ethers.parseUnits("10000", 6));
    });

    it("should have correct initial state", async function() {
        const marketAddress = await market.getAddress();
        expect(await yesToken.balanceOf(marketAddress)).to.equal(ethers.parseUnits("500", 18));
        expect(await noToken.balanceOf(marketAddress)).to.equal(ethers.parseUnits("500", 18));
        const probability = await market.getProbability();
        expect(Number(ethers.formatUnits(probability, 18))).to.be.closeTo(50, 0.01);
    });

    it("should handle bets correctly according to the new spec", async function () {
        const marketAddress = await market.getAddress();

        // Test 1: Alice bets 100 USDC on "yes"
        await market.connect(alice).bet(ethers.parseUnits("100", 6), true);

        let noBalance = await noToken.balanceOf(marketAddress);
        let yesBalance = await yesToken.balanceOf(marketAddress);
        let aliceYesBalance = await yesToken.balanceOf(alice.address);
        let tolerance = ethers.parseUnits("0.0001", 18)
        expect(noBalance).to.equal(ethers.parseUnits("600", 18));
        expect(yesBalance).to.be.closeTo(ethers.parseUnits("416.666666666666666667", 18),tolerance);
        expect(aliceYesBalance).to.be.closeTo(ethers.parseUnits("83.333333333333333333", 18),tolerance);

        // Test 2: Alice bets another 100 USDC on "yes"
        await market.connect(alice).bet(ethers.parseUnits("100", 6), true);

        noBalance = await noToken.balanceOf(marketAddress);
        yesBalance = await yesToken.balanceOf(marketAddress);
        aliceYesBalance = await yesToken.balanceOf(alice.address);

        expect(noBalance).to.equal(ethers.parseUnits("700", 18));
        expect(yesBalance).to.be.closeTo(ethers.parseUnits("357.142857142857142857", 18),tolerance);
        
        const expectedAliceYes = ethers.toBigInt(ethers.parseUnits("83.333333333333333333", 18)) + ethers.toBigInt(ethers.parseUnits("59.52380952380952381", 18));
        expect(aliceYesBalance).to.be.closeTo(expectedAliceYes,tolerance);
        
        expect(await yesToken.totalSupply()).to.equal(ethers.parseUnits("500", 18));
        expect(await noToken.totalSupply()).to.equal(ethers.parseUnits("700", 18));

        // Test 3: Alice bets 1 USDC on "yes"
        const aliceYesBefore = await yesToken.balanceOf(alice.address);
        await market.connect(alice).bet(ethers.parseUnits("1", 6), true);
        const aliceYesAfter = await yesToken.balanceOf(alice.address);
        const yesTokensReceived = aliceYesAfter - aliceYesBefore;

        expect(yesTokensReceived).to.be.closeTo(ethers.parseUnits("0.509477216218612629", 18), ethers.parseUnits("0.0001", 18));
    });

    it("should calculate the correct probability after a bet", async function () {
        // Probability starts at 50%
        let probability = await market.getProbability();
        expect(Number(ethers.formatUnits(probability, 18))).to.be.closeTo(50, 0.01);

        // Alice places a bet on "yes" with 100 USDC
        await market.connect(alice).bet(ethers.parseUnits("100", 6), true);

        // After the bet, the pool has ~416.67 yes and 600 no
        // Probability of yes is 600 / (416.66667 + 600) = 0.5901...
        probability = await market.getProbability();
        expect(Number(ethers.formatUnits(probability, 18))).to.be.closeTo(59.01, 0.01);
    });

    it("should resolve the market", async function () {
        await market.connect(oracle).resolve(true);
        expect(await market.resolved()).to.be.true;
        expect(await market.outcome()).to.be.true;
    });
}) : describe.skip;

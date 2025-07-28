const { ethers } = require("hardhat");

async function main() {
  // Deploy Mock USDC
  const MockUSDC = await ethers.getContractFactory("MintableERC20");
  const usdc = await MockUSDC.deploy("Mock USDC", "USDC");
  await usdc.waitForDeployment();
  console.log("Mock USDC deployed to:", usdc.target);

  // Get PredictionMarketFactory instance
  const PREDICTION_MARKET_FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarketFactory");
  const factory = await PredictionMarketFactory.attach(PREDICTION_MARKET_FACTORY_ADDRESS);

  // Create a sample market
  const question = "Will AI surpass human intelligence by 2030?";
  const category = 2; // Crypto (using 2 for Crypto as per enum in contract)

  const tx = await factory.createMarket(usdc.target, question, category);
  const receipt = await tx.wait();

  // Find the MarketCreated event to get the new market's address
  const marketCreatedEvent = receipt.logs.find(
    (log) => factory.interface.parseLog(log)?.name === "MarketCreated"
  );

  if (marketCreatedEvent) {
    const newMarketAddress = marketCreatedEvent.args.marketAddress;
    console.log("New PredictionMarket created at:", newMarketAddress);

    // Initialize the market with some liquidity
    const initialLiquidity = ethers.parseUnits("500", 6); // 500 USDC
    const predictionMarket = await ethers.getContractAt("PredictionMarket", newMarketAddress);

    // Mint USDC to the deployer and approve the market to spend it
    const [deployer] = await ethers.getSigners();
    await usdc.mint(deployer.address, initialLiquidity);
    await usdc.approve(newMarketAddress, initialLiquidity);

    const initTx = await predictionMarket.initializeMarket(initialLiquidity);
    await initTx.wait();
    console.log("PredictionMarket initialized with liquidity.");

  } else {
    console.error("MarketCreated event not found.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

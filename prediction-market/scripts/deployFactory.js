const { ethers } = require("hardhat");

async function main() {
  const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarketFactory");
  const predictionMarketFactory = await PredictionMarketFactory.deploy();

  await predictionMarketFactory.waitForDeployment();

  console.log("PredictionMarketFactory deployed to:", predictionMarketFactory.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// deploy/00-deploy-mocks.js

const { network } = require("hardhat");
const { developmentChains, usdcDecimals } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // Only deploy mocks on development chains
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");

    await deploy("MockUSDC", {
      from: deployer,
      log: true,
      args: [], // No constructor arguments for MockUSDC
    });

    log("Mocks Deployed!");
    log("------------------------------------------------");
  }
};

// Add a tag so we can run this script specifically if needed
module.exports.tags = ["all", "mocks"];

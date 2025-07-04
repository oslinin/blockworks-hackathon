// helper-hardhat-config.js

const { ethers } = require("hardhat");

const networkConfig = {
  // Sepolia (ChainID 11155111)
  11155111: {
    name: "sepolia",
    // Official Sepolia USDC contract address
    usdcToken: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7a98",
    // The initial liquidity to add, as a string.
    initialLiquidityUSDC: "500",
  },
  // Hardhat Local Network (ChainID 31337)
  31337: {
    name: "hardhat",
    // On local, we use a mock. The address will be determined by the mock deploy script.
    usdcToken: null,
    initialLiquidityUSDC: "500",
  },
};

const developmentChains = ["hardhat", "localhost"];
const usdcDecimals = 6;

module.exports = {
  networkConfig,
  developmentChains,
  usdcDecimals,
};

const { ethers } = require("hardhat")

const networkConfig = {
    31337: {
        name: "localhost",
        usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // mainnet USDC
    },
    11155111: {
        name: "sepolia",
        usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
}

const developmentChains = ["localhost", "hardhat"];

module.exports = {
    networkConfig,
    developmentChains,
}


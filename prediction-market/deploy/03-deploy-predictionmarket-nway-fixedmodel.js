const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");
    const usdc = await get("MintableERC20");
    const arguments = [
        "A sample N-way fixed model question?",
        0, // ELECTION
        deployer,
        usdc.address,
        3 // Number of outcomes
    ];
    const predictionMarketNWayFixedModel = await deploy("PredictionMarketNWayFixedModel", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(predictionMarketNWayFixedModel.address, arguments);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "predictionmarketnwayfixedmodel"];

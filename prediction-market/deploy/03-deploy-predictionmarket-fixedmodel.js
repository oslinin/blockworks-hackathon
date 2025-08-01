const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");
    const usdc = await get("MintableERC20");
    const arguments = [
        "A sample fixed model question?",
        0, // ELECTION
        deployer,
        usdc.address
    ];
    const predictionMarketFixedModel = await deploy("PredictionMarketFixedModel", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(predictionMarketFixedModel.address, arguments);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "predictionmarketfixedmodel"];

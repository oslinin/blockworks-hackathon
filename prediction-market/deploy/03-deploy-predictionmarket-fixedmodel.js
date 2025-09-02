const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId

    log("----------------------------------------------------");
    let usdcAddress
    if (chainId == 31337) {
        if (network.name === "hardhat") {
            usdcAddress = networkConfig[chainId].usdcAddress
        } else {
            const usdc = await deployments.get("MintableERC20")
            usdcAddress = usdc.address
        }
    } else {
        usdcAddress = networkConfig[chainId].usdcAddress
    }
    const arguments = [
        "A sample fixed model question?",
        0, // ELECTION
        deployer,
        usdcAddress
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

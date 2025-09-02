const { network } = require("hardhat");
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const args = [];
    const predictionMarketFactoryNWay = await deploy(
        "PredictionMarketFactoryNWay",
        {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: waitBlockConfirmations,
        }
    );

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(predictionMarketFactoryNWay.address, args);
    }
};

module.exports.tags = ["all", "factoryNWay"];


module.exports.tags = ["all", "factoryNWay"];

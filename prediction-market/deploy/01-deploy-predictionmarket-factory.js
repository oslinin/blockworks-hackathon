const { network } = require("hardhat");
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const args = [];
    const predictionMarketFactory = await deploy("PredictionMarketFactory", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(predictionMarketFactory.address, args);
    }

    const chainId = network.config.chainId;
    const whitelistedAddress = networkConfig[chainId].whitelistedAddress;

    const predictionMarketFactoryDeployment = await deployments.get("PredictionMarketFactory");
    const predictionMarketFactoryContract = await ethers.getContractAt("PredictionMarketFactory", predictionMarketFactoryDeployment.address);
    if (whitelistedAddress) {
        log(`Adding ${whitelistedAddress} to whitelist...`);
        const tx = await predictionMarketFactoryContract.addToWhitelist(whitelistedAddress);
        await tx.wait();
    }
};

module.exports.tags = ["all", "factory"];

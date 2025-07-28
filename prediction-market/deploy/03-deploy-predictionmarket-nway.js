const { ethers, network } = require("hardhat");
const {
    developmentChains,
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, get, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    let usdcAddress;
    if (developmentChains.includes(network.name)) {
        const usdc = await deployments.get("MintableERC20");
        usdcAddress = usdc.address;
    } else {
        usdcAddress = networkConfig[chainId].usdcAddress;
    }

    const factory = await get("PredictionMarketFactoryNWay");

    const args = [
        "Who will win the 2024 US Election?",
        0, // ELECTION
        deployer,
        usdcAddress,
        ["Biden", "Trump", "Other"],
        ["BIDEN", "TRUMP", "OTHER"],
        ethers.parseUnits("1000", 6),
    ];
    const predictionMarketNWay = await deploy("PredictionMarketNWay", {
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
        await verify(predictionMarketNWay.address, args);
    }
};

module.exports.tags = ["all", "marketNWay"];
module.exports.dependencies = ["factoryNWay"];


module.exports.tags = ["all", "marketNWay"];
module.exports.dependencies = ["factoryNWay"];

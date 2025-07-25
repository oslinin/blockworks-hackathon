const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
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
    if (chainId == 31337) {
        const usdc = await deployments.get("MintableERC20");
        usdcAddress = usdc.address;
    } else {
        usdcAddress = networkConfig[chainId].usdcAddress;
    }

    const factory = await get("PredictionMarketFactory");

    const args = [
        "Will LINK reach $20 by end of year?",
        0, // ELECTION
        deployer,
        usdcAddress,
        "0x0000000000000000000000000000000000000000", // dummy address
        "0x0000000000000000000000000000000000000000", // dummy address
    ];
    const predictionMarket = await deploy("PredictionMarket", {
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
        await verify(predictionMarket.address, args);
    }
};

module.exports.tags = ["all", "market"];
module.exports.dependencies = ["factory"];


module.exports.tags = ["all", "market"];
module.exports.dependencies = ["factory"];

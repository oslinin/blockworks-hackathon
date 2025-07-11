const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const usdc = await deployments.get("MintableERC20");
    const factory = await get("PredictionMarketFactory");

    await deploy("PredictionMarket", {
        from: deployer,
        args: [
            "Will LINK reach $20 by end of year?",
            0, // ELECTION
            deployer,
            usdc.address,
            "0x0000000000000000000000000000000000000000", // dummy address
            "0x0000000000000000000000000000000000000000", // dummy address
        ],
        log: true,
    });
};

module.exports.tags = ["all", "market"];
module.exports.dependencies = ["all"];

module.exports.tags = ["all", "market"];
module.exports.dependencies = ["factory"];

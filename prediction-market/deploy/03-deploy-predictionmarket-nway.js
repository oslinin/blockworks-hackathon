const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const usdc = await deployments.get("MintableERC20");
    const factory = await get("PredictionMarketFactoryNWay");

    await deploy("PredictionMarketNWay", {
        from: deployer,
        args: [
            "Who will win the 2024 US Election?",
            0, // ELECTION
            deployer,
            usdc.address,
            ["Biden", "Trump", "Other"],
            ["BIDEN", "TRUMP", "OTHER"],
            ethers.parseUnits("1000", 6),
        ],
        log: true,
    });
};

module.exports.tags = ["all", "marketNWay"];
module.exports.dependencies = ["factoryNWay"];

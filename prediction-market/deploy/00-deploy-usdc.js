const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (chainId == 31337) {
        await deploy("MintableERC20", {
            from: deployer,
            args: ["USD Coin", "USDC"],
            log: true,
        });
    }
};

module.exports.tags = ["all", "usdc"];


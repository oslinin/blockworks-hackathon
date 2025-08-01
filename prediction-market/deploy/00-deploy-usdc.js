const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (network.name === "sepolia") {
        log("Skipping deployment of MintableERC20 on Sepolia");
        return;
    }

    log("Deploying MintableERC20...");
    const usdc = await deploy("MintableERC20", {
        from: deployer,
        args: ["USD Coin", "USDC"],
        log: true,
    });
    log(`MintableERC20 deployed at ${usdc.address}`);
};

module.exports.tags = ["all", "usdc"];
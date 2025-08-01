const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

<<<<<<< HEAD
    await deploy("MintableERC20", {
=======
    if (network.name === "sepolia") {
        log("Skipping deployment of MintableERC20 on Sepolia");
        return;
    }

    log("Deploying MintableERC20...");
    const usdc = await deploy("MintableERC20", {
>>>>>>> bc9187a3c59ce80f9536c83efc586581c7cdd460
        from: deployer,
        args: ["USD Coin", "USDC"],
        log: true,
    });
<<<<<<< HEAD
=======
    log(`MintableERC20 deployed at ${usdc.address}`);
>>>>>>> bc9187a3c59ce80f9536c83efc586581c7cdd460
};

module.exports.tags = ["all", "usdc"];


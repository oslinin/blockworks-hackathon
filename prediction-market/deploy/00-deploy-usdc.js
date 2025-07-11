module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("MintableERC20", {
        from: deployer,
        args: ["USD Coin", "USDC"],
        log: true,
    });
};

module.exports.tags = ["all", "usdc"];

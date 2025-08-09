const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log } = deployments
    const chainId = network.config.chainId

    if (chainId == 31337) {
        log("Using mainnet USDC address on forked hardhat network")
    } else {
        log("Skipping deployment of MintableERC20 on production network")
    }
}

module.exports.tags = ["all", "usdc"]
const { network, ethers, getNamedAccounts } = require("hardhat")

module.exports = async ({ deployments }) => {
    const { log } = deployments
    const chainId = network.config.chainId

    if (chainId == 31337 && network.name === "hardhat") {
        log("----------------------------------------------------")
        log("Funding deployer with USDC on forked hardhat network")
        const { deployer } = await getNamedAccounts()
        const usdcWhaleAddress = "0x5041ed759Dd4aFc3a72b8192C143F72f4724081A" // Coinbase 10
        const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        const amount = ethers.parseUnits("100", 6) // 100 USDC

        const usdcWhale = await ethers.getImpersonatedSigner(usdcWhaleAddress)
        const usdc = await ethers.getContractAt("ERC20", usdcAddress)

        const balanceBefore = await usdc.balanceOf(deployer)
        log(`Deployer USDC balance before funding: ${ethers.formatUnits(balanceBefore, 6)} USDC`)

        if (balanceBefore < amount) {
            log(`Funding ${deployer} with ${ethers.formatUnits(amount, 6)} USDC...`)
            const tx = await usdc.connect(usdcWhale).transfer(deployer, amount)
            await tx.wait()

            const balanceAfter = await usdc.balanceOf(deployer)
            log(`Successfully funded. New balance: ${ethers.formatUnits(balanceAfter, 6)} USDC`)
        } else {
            log("Deployer already has enough USDC. Skipping funding.")
        }
        log("----------------------------------------------------")
    }
}

module.exports.tags = ["all", "fund"]

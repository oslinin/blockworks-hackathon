const { ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function dropRaffleAsConsumer() {
    const deployer = (await getNamedAccounts()).deployer
    const raffle = await ethers.getContract("Raffle", deployer)
    const chainId = network.config.chainId
    const vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinatorV2"]
    const subscriptionId = networkConfig[chainId]["subscriptionId"]

    const vrfCoordinator = await ethers.getContractAt(
        "VRFv2SubscriptionManager",
        vrfCoordinatorAddress,
        deployer
    )
    const tx = await vrfCoordinator.removeConsumer(raffle.address, {
        gasLimit: 500000,
    })
    await tx.wait()
    console.log(
        `Raffle contract removed as consumer to VRFCoordinator with subscription ID: ${subscriptionId}`
    )
    // const isValid = await raffle.checkVRFCoordinator()
    // console.log(`VRF Coordinator is valid: ${isValid}`)
}

dropRaffleAsConsumer()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error)
        process.exit(1)
    })

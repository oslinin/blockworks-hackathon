const { ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function addRaffleAsConsumer() {
    const deployer = (await getNamedAccounts()).deployer
    const raffle = await ethers.getContract("Raffle", deployer)
    const chainId = network.config.chainId

    //const vrfCoordinatorAddress = "0x1885f9ef4102715bf31cbb804c6e722feff27b09" // Replace with actual VRFCoordinator address
    // const subscriptionId = "12059" // Replace with actual subscription ID
    const vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinatorV2"]
    const subscriptionId = networkConfig[chainId]["subscriptionId"]

    const vrfCoordinator = await ethers.getContractAt(
        "VRFv2SubscriptionManager",
        vrfCoordinatorAddress,
        deployer
    )
    console.log(
        ` Trying VRF: ${vrfCoordinatorAddress} Subid ${subscriptionId} add ${raffle.address} found ${vrfCoordinator.address}`
    )
    const tx = await vrfCoordinator.addConsumer(raffle.address, {
        gasLimit: 500000,
    })
    await tx.wait()
    console.log(
        `Raffle contract added as consumer to VRFCoordinator with subscription ID: ${subscriptionId}`
    )
    // const isValid = await raffle.checkVRFCoordinator()
    // console.log(`VRF Coordinator is valid: ${isValid}`)
}

addRaffleAsConsumer()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error)
        process.exit(1)
    })

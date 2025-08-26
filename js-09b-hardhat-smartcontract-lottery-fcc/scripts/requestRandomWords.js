const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function requestRandomWords() {
    const deployer = (await getNamedAccounts()).deployer
    const raffle = await ethers.getContract("Raffle", deployer)
    const chainId = network.config.chainId

    // Create a provider instance
    const provider = ethers.getDefaultProvider(network.name)

    // Get the code at the specified address
    const code = await provider.getCode(networkConfig[chainId]["vrfCoordinatorV2"])
    // console.log(`Code at address ${networkConfig[chainId]["vrfCoordinatorV2"]}:`, code)

    const vrfCoordinator = await ethers.getContractAt(
        "VRFv2SubscriptionManager",
        networkConfig[chainId]["vrfCoordinatorV2"],
        deployer
    )

    const tx = await vrfCoordinator.requestRandomWords(
        /*networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["subscriptionId"],
        3,
        networkConfig[chainId]["callbackGasLimit"],
        2,*/
        {
            gasLimit: 500000,
        }
    )
    await tx.wait()
    // const isValid = await raffle.checkVRFCoordinator()
    // console.log(`VRF Coordinator is valid: ${isValid}`)
}

requestRandomWords()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error)
        process.exit(1)
    })

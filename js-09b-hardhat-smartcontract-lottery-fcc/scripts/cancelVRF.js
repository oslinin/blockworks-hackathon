const { ethers, network, deployments } = require("hardhat")
const { verify } = require("../utils/verify")
async function cancelVRF() {
    const { deploy, log } = deployments
    const [deployer] = await ethers.getSigners()
    const chainId = network.config.chainId
    // const VRF_COORDINATOR_ADDRESS = "0x1885F9eF4102715bF31cBb804c6e722FeFf27B09"
    // const SUBSCRIPTION_ID = "12059"
    const VRF_COORDINATOR_ADDRESS = "0xc02c5a272a76789e4591ca1f208d195559406cc8"
    const SUBSCRIPTION_ID = "12009"

    if (chainId == 11155111) {
        const vrfCoordinator = await ethers.getContractAt(
            "VRFCoordinatorV2Interface",
            VRF_COORDINATOR_ADDRESS,
            deployer
        )
        const cancel = await vrfCoordinator.cancelSubscription(SUBSCRIPTION_ID, deployer.address, {
            gasLimit: 5000000,
        })
        await cancel.wait()
    }
}
cancelVRF()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error)
        process.exit(1)
    })

const { ethers, network } = require("hardhat")
const { verify } = require("../utils/verify")

async function makeCoordinator() {
    const { deploy, log } = deployments
    // const { deployer } = await getNamedAccounts()
    const [deployer] = await ethers.getSigners()

    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 11155111) {
        console.log("sepolia!...")
        //https://docs.chain.link/vrf/v2/subscription/examples/programmatic-subscription
        // const manager = await deploy("VRFv2SubscriptionManager", {
        //     from: deployer,
        //     log: true,
        // }) //12059.12063
        // await verify(manager.address)
        // const subscriptionId = await manager.s_subscriptionId()

        const vrfCoordinator = await ethers.getContractAt(
            "VRFv2SubscriptionManager",
            "0x33a9c64e7b8a59d3f34abe77235edf40c1eec66e",
            deployer.address
        ) //12063

        // const owner = await vrfCoordinator.s_owner()
        // const subscriptionId = await vrfCoordinator.cancelSubscription()
        // console.log(`SubscriptionId ${subscriptionId} `)

        console.log("----------------------------------------------------------")

        console.log("Checking LINK balance of:", deployer.address)

        const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789" // LINK token address on mainnet

        const linkTokenAbi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function approve(address spender, uint256 amount) public returns (bool)",
        ]

        const linkTokenContract = new ethers.Contract(linkTokenAddress, linkTokenAbi, deployer)

        const balance = await linkTokenContract.balanceOf(deployer.address)
        console.log("LINK Balance:", ethers.utils.formatUnits(balance, 18))
        console.log("----------------------------------------------------------")

        const amount = ethers.utils.parseUnits("3", 18)
        console.log(
            `Top up subscription with ${ethers.utils.formatUnits(amount, 18).toString()} LINK`
        )
        console.log("----------------------------------------------------------")

        // Approve the VRF Coordinator to spend the LINK tokens
        const approvalTx = await linkTokenContract.approve(vrfCoordinator.address, amount)
        await approvalTx.wait()
        console.log("Approved LINK transfer to VRF Coordinator")
        console.log("----------------------------------------------------------")

        const topUpTx = await vrfCoordinator.topUpSubscription(amount, {
            gasLimit: 2000000,
        })
        await topUpTx.wait()
        console.log(`Topped up subscription with ${amount.toString()} LINK`)
        console.log("VRFv2SubscriptionManager Funded!")
        console.log("----------------------------------------------------------")

        // const vrfCoordinatorV2Address = manager.address

        const arguments = [
            vrfCoordinatorV2Address,
            subscriptionId,
            networkConfig[chainId]["gasLane"],
            networkConfig[chainId]["keepersUpdateInterval"],
            networkConfig[chainId]["raffleEntranceFee"],
            networkConfig[chainId]["callbackGasLimit"],
        ]
        const raffle = await deploy("Raffle", {
            from: deployer,
            args: arguments,
            log: true,
            waitConfirmations: waitBlockConfirmations,
        })
        const tx = await vrfCoordinator.addConsumer(subscriptionId, raffle.address, {
            gasLimit: 500000,
        })
        await tx.wait()
        console.log(
            `Raffle contract added as consumer to VRFCoordinator with subscription ID: ${subscriptionId}`
        )
    }
}

makeCoordinator()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

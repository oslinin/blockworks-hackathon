const { ethers, network, deployments } = require("hardhat")
const { verify } = require("../utils/verify")
const { networkConfig } = require("../helper-hardhat-config")
//npm install @openzeppelin/contracts
const IERC20 = require("@openzeppelin/contracts/build/contracts/IERC20.json")

async function fundCoordinator() {
    const { deploy, log } = deployments
    const [deployer] = await ethers.getSigners()
    const chainId = network.config.chainId
    const VRF_COORDINATOR_ADDRESS = networkConfig[chainId]["vrfCoordinatorV2"]
    const LINK_TOKEN_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789" // Replace with the correct LINK token address on your network

    if (chainId == 11155111) {
        const vrfCoordinator = await ethers.getContractAt(
            "VRFv2SubscriptionManager",
            VRF_COORDINATOR_ADDRESS,
            deployer
        )

        const linkTokenAbi = [
            {
                constant: true,
                inputs: [
                    {
                        name: "_owner",
                        type: "address",
                    },
                ],
                name: "balanceOf",
                outputs: [
                    {
                        name: "balance",
                        type: "uint256",
                    },
                ],
                type: "function",
            },
            {
                constant: false,
                inputs: [
                    {
                        name: "_spender",
                        type: "address",
                    },
                    {
                        name: "_value",
                        type: "uint256",
                    },
                ],
                name: "approve",
                outputs: [
                    {
                        name: "success",
                        type: "bool",
                    },
                ],
                type: "function",
            },
        ]

        // Initialize the contract with the correct ABI and address
        const linkTokenContract = new ethers.Contract(LINK_TOKEN_ADDRESS, linkTokenAbi, deployer)
        const amount = ethers.utils.parseUnits("1", 18)

        // Use the approve function
        const approveTx = await linkTokenContract.approve(deployer.address, amount)
        await approveTx.wait()
        // const linkTokenContract = new ethers.Contract(LINK_TOKEN_ADDRESS, linkTokenAbi, deployer)
        // const linkTokenContract = new ethers.Contract(LINK_TOKEN_ADDRESS, IERC20.abi, deployer)
        // Approve the VRF Coordinator to spend LINK tokens
        const approveTx2 = await linkTokenContract.approve(VRF_COORDINATOR_ADDRESS, amount)
        await approveTx2.wait()

        // Top up the subscription
        const topUpTx = await vrfCoordinator.topUpSubscription(amount, {
            gasLimit: 1000000,
        })
        await topUpTx.wait()

        console.log(`Topped up subscription with ${amount.toString()} LINK`)
    } else {
        console.log("This script is only for the specified chain ID.")
    }
}

fundCoordinator()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

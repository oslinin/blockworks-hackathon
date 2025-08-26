const { ethers } = require("hardhat")

async function getbalance() {
    const [deployer] = await ethers.getSigners()

    console.log("Checking LINK balance of:", deployer.address)

    const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789" // LINK token address on mainnet

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
    ]

    const linkTokenContract = new ethers.Contract(linkTokenAddress, linkTokenAbi, deployer)

    const balance = await linkTokenContract.balanceOf(deployer.address)
    console.log("LINK Balance:", ethers.utils.formatUnits(balance, 18))
}

getbalance()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

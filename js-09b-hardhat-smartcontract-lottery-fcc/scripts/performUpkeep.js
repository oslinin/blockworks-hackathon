const { getNamedAccounts, ethers, network } = require("hardhat")

// async function PerformUpkeep() {
//     const deployer = (await getNamedAccounts()).deployer
//     const raffle = await ethers.getContract("Raffle", deployer)
//     const raffleEntranceFee = await raffle.getEntranceFee()

//     const tx = await raffle.performUpkeep("0x", { gasLimit: 3000000 })
//     console.log(tx)
// }

// PerformUpkeep()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

async function performUpkeep() {
    try {
        const deployer = (await getNamedAccounts()).deployer
        const raffle = await ethers.getContract("Raffle", deployer)

        console.log("Performing upkeep...")
        const tx = await raffle.performUpkeep("0x", { gasLimit: 10000000 })
        const receipt = await tx.wait()

        console.log(`Transaction successful with hash: ${receipt.transactionHash}`)
        console.log("Receipt:", receipt)
    } catch (error) {
        console.error("Transaction failed")
        if (error.error && error.error.message) {
            console.error("Error message:", error.error.message)
        } else {
            console.error("Error:", error)
        }

        // Log additional error details if available
        if (error.receipt) {
            console.error("Transaction receipt:", error.receipt)
        }
        if (error.transactionHash) {
            console.error("Transaction hash:", error.transactionHash)
        }
    }
}

performUpkeep()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error)
        process.exit(1)
    })

const { ethers } = require("hardhat")

async function checkVRFCoordinator() {
    const deployer = (await getNamedAccounts()).deployer
    const raffle = await ethers.getContract("Raffle", deployer)

    const isValid = await raffle.checkVRFCoordinator({
        gasLimit: 500000,
    })
    console.log(`VRF Coordinator is valid: ${isValid}`)
}

checkVRFCoordinator()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error)
        process.exit(1)
    })

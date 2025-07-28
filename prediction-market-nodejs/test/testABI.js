const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function testABI() {
    try {
        // Load the ABI from the artifacts
        const factoryAbiPath = path.resolve(__dirname, "../../prediction-market/artifacts/contracts/PredictionMarketFactory.sol/PredictionMarketFactory.json");
        const factoryAbi = JSON.parse(fs.readFileSync(factoryAbiPath, "utf8")).abi;

        // Placeholder for the deployed contract address.
        // You will need to replace this with the actual deployed address of your PredictionMarketFactory contract.
        // This can be obtained after deploying the contract on your local Hardhat network or a testnet.
        const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address, replace with actual

        // Connect to a local Hardhat network (or any other network)
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

        // Create a contract instance
        const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);

        console.log("Successfully instantiated PredictionMarketFactory contract:");
        console.log("Address:", factoryContract.target);
        console.log("ABI loaded successfully.");

        // You can add more tests here, for example, calling a view function
        // const allMarkets = await factoryContract.getAllMarkets();
        // console.log("All markets:", allMarkets);

    } catch (error) {
        console.error("Error testing ABI:", error);
        process.exit(1);
    }
}

testABI();

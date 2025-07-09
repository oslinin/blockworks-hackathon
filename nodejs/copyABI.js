const fs = require('fs');
const path = require('path');

const factoryAbiPath = path.resolve(__dirname, '../prediction-market/artifacts/contracts/PredictionMarketFactory.sol/PredictionMarketFactory.json');
const factoryAbi = JSON.parse(fs.readFileSync(factoryAbiPath, 'utf8')).abi;

// Placeholder for the deployed contract address.
// You will need to replace this with the actual deployed address of your PredictionMarketFactory contract.
// This can be obtained after deploying the contract on your local Hardhat network or a testnet.
const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address, replace with actual

const constantsContent = `
export const PREDICTION_MARKET_FACTORY_ABI = ${JSON.stringify(factoryAbi, null, 2)};
export const PREDICTION_MARKET_FACTORY_ADDRESS = "${factoryAddress}";
`;

const constantsFilePath = path.resolve(__dirname, 'constants.js');
fs.writeFileSync(constantsFilePath, constantsContent);

console.log('ABI and contract address copied to constants.js');

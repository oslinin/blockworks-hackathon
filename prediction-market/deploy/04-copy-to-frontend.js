const fs = require("fs");
const path = require("path");

const SEPOLIA_USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

module.exports = async ({ deployments, getNamedAccounts, network }) => {
    console.log("Writing to front end...");

    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId.toString();

    const getDeploymentData = async (contractName) => {
        try {
            const deployment = await deployments.get(contractName);
            return { address: deployment.address, abi: deployment.abi };
        } catch (error)
{
            console.log(`Deployment for ${contractName} not found on network ${network.name}.`);
            return null;
        }
    };

    const predictionMarket = await getDeploymentData("PredictionMarket");
    const predictionMarketFactory = await getDeploymentData("PredictionMarketFactory");
    const predictionMarketNWay = await getDeploymentData("PredictionMarketNWay");
    const predictionMarketFactoryNWay = await getDeploymentData("PredictionMarketFactoryNWay");
    const predictionMarketFactoryFixedModel = await getDeploymentData("PredictionMarketFactoryFixedModel");
    const predictionMarketFactoryNWayFixedModel = await getDeploymentData("PredictionMarketFactoryNWayFixedModel");
    let usdcContractData;

    const erc20Abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/ERC20.json"), "utf8"));

    if (network.name === "hardhat") {
        usdcContractData = {
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Mainnet USDC
            abi: erc20Abi,
        };
    } else if (network.name === "sepolia") {
        usdcContractData = {
            address: SEPOLIA_USDC_ADDRESS,
            abi: erc20Abi,
        };
    } else {
        usdcContractData = await getDeploymentData("MintableERC20");
    }

    const frontendAbiDir = path.resolve(__dirname, `../../prediction-market-nodejs/abi`);

    if (!fs.existsSync(frontendAbiDir)) {
        fs.mkdirSync(frontendAbiDir, { recursive: true });
    }

    const writeAbiFile = (contractName, data) => {
        if (data) {
            fs.writeFileSync(
                path.join(frontendAbiDir, `${contractName}.json`),
                JSON.stringify(data.abi, null, 2)
            );
        }
    };

    writeAbiFile("PredictionMarket", predictionMarket);
    writeAbiFile("PredictionMarketFactory", predictionMarketFactory);
    writeAbiFile("PredictionMarketNWay", predictionMarketNWay);
    writeAbiFile("PredictionMarketFactoryNWay", predictionMarketFactoryNWay);
    writeAbiFile("PredictionMarketFactoryFixedModel", predictionMarketFactoryFixedModel);
    writeAbiFile("PredictionMarketFactoryNWayFixedModel", predictionMarketFactoryNWayFixedModel);
    if (usdcContractData) {
        const usdcAbiPath = network.name === "sepolia" ? "OfficialUSDC.json" : "MintableERC20.json";
        fs.writeFileSync(
            path.join(frontendAbiDir, usdcAbiPath),
            JSON.stringify(usdcContractData.abi, null, 2)
        );
    }


    const contractAddressesPath = path.join(frontendAbiDir, "contract-addresses.json");
    let contractAddresses = {};
    if (fs.existsSync(contractAddressesPath)) {
        contractAddresses = JSON.parse(fs.readFileSync(contractAddressesPath, "utf8"));
    }

    const networkName = network.name === "hardhat" ? "localhost" : network.name;

    contractAddresses[networkName] = {
        PredictionMarket: predictionMarket ? predictionMarket.address : null,
        PredictionMarketFactory: predictionMarketFactory ? predictionMarketFactory.address : null,
        PredictionMarketNWay: predictionMarketNWay ? predictionMarketNWay.address : null,
        PredictionMarketFactoryNWay: predictionMarketFactoryNWay ? predictionMarketFactoryNWay.address : null,
        PredictionMarketFactoryFixedModel: predictionMarketFactoryFixedModel ? predictionMarketFactoryFixedModel.address : null,
        PredictionMarketFactoryNWayFixedModel: predictionMarketFactoryNWayFixedModel ? predictionMarketFactoryNWayFixedModel.address : null,
        USDC: usdcContractData ? usdcContractData.address : null,
    };

    if (network.name === "hardhat" || network.name === "localhost") {
        const mintableERC20 = await getDeploymentData("MintableERC20");
        if (mintableERC20) {
            contractAddresses[networkName].MintableERC20 = mintableERC20.address;
            // Also ensure USDC is set to the MintableERC20 address for local development
            contractAddresses[networkName].USDC = mintableERC20.address;
        }
    }

    fs.writeFileSync(
        contractAddressesPath,
        JSON.stringify(contractAddresses, null, 2)
    );

    console.log(`Front end written for ${networkName}!`);
};

module.exports.tags = ["all", "frontend"];
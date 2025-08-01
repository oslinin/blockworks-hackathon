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
        } catch (error) {
            console.log(`Deployment for ${contractName} not found on network ${network.name}.`);
            return null;
        }
    };

    const predictionMarket = await getDeploymentData("PredictionMarket");
    const predictionMarketFactory = await getDeploymentData("PredictionMarketFactory");
    const predictionMarketNWay = await getDeploymentData("PredictionMarketNWay");
    const predictionMarketFactoryNWay = await getDeploymentData("PredictionMarketFactoryNWay");
    let usdcContractData;

    if (network.name === "sepolia") {
        const erc20Abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../node_modules/@openzeppelin/contracts/build/contracts/ERC20.json"), "utf8")).abi;
        usdcContractData = {
            address: SEPOLIA_USDC_ADDRESS,
            abi: erc20Abi,
        };
    } else {
        usdcContractData = await getDeploymentData("MintableERC20");
    }

    const frontendAbiDir = path.resolve(__dirname, `../../prediction-market-nodejs/abi/${network.name}`);

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
    // Rename to MintableERC20 for consistency in the frontend
    if (usdcContractData) {
        fs.writeFileSync(
            path.join(frontendAbiDir, `MintableERC20.json`),
            JSON.stringify(usdcContractData.abi, null, 2)
        );
    }


    const contractAddresses = {
        PredictionMarket: predictionMarket ? predictionMarket.address : null,
        PredictionMarketFactory: predictionMarketFactory ? predictionMarketFactory.address : null,
        PredictionMarketNWay: predictionMarketNWay ? predictionMarketNWay.address : null,
        PredictionMarketFactoryNWay: predictionMarketFactoryNWay ? predictionMarketFactoryNWay.address : null,
        MintableERC20: usdcContractData ? usdcContractData.address : null,
    };

    fs.writeFileSync(
        path.join(frontendAbiDir, "contract-addresses.json"),
        JSON.stringify(contractAddresses, null, 2)
    );

    console.log(`Front end written for ${network.name}!`);
};

module.exports.tags = ["all", "frontend"];
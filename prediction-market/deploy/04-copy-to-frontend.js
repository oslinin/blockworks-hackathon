const fs = require("fs");
const path = require("path");

module.exports = async ({ deployments, network }) => {
    console.log("Writing to front end...");

    const deploymentsData = {
        PredictionMarket: await deployments.get("PredictionMarket"),
        PredictionMarketFactory: await deployments.get("PredictionMarketFactory"),
        PredictionMarketNWay: await deployments.get("PredictionMarketNWay"),
        PredictionMarketFactoryNWay: await deployments.get("PredictionMarketFactoryNWay"),
        PredictionMarketFactoryFixedModel: await deployments.get("PredictionMarketFactoryFixedModel"),
        PredictionMarketFixedModel: await deployments.get("PredictionMarketFixedModel"),
        PredictionMarketFactoryNWayFixedModel: await deployments.get("PredictionMarketFactoryNWayFixedModel"),
        PredictionMarketNWayFixedModel: await deployments.get("PredictionMarketNWayFixedModel"),
        MintableERC20: await deployments.get("MintableERC20"),
    };

    const frontendAbiDir = path.resolve(__dirname, "../../prediction-market-nodejs/abi");
    if (!fs.existsSync(frontendAbiDir)) {
        fs.mkdirSync(frontendAbiDir, { recursive: true });
    }

    const contractAddresses = {};
    for (const [name, deployment] of Object.entries(deploymentsData)) {
        fs.writeFileSync(
            path.join(frontendAbiDir, `${name}.json`),
            JSON.stringify(deployment.abi, null, 2)
        );
        if (name === "MintableERC20") {
            contractAddresses["USDC"] = deployment.address;
        } else {
            contractAddresses[name] = deployment.address;
        }
    }

    const networkName = (network.name === "hardhat" || network.name === "localhost") ? "localhost" : network.name;
    const addressesFilePath = path.join(frontendAbiDir, "contract-addresses.json");
    
    let addresses = {};
    if (fs.existsSync(addressesFilePath)) {
        addresses = JSON.parse(fs.readFileSync(addressesFilePath, "utf8"));
    }

    addresses[networkName] = contractAddresses;

    fs.writeFileSync(
        addressesFilePath,
        JSON.stringify(addresses, null, 2)
    );

    console.log(`Front end written for ${networkName} network!`);
};

module.exports.tags = ["all", "frontend"];

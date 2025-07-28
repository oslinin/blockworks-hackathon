const fs = require("fs");
const path = require("path");

module.exports = async ({ deployments }) => {
    console.log("Writing to front end...");

    const PredictionMarket = await deployments.get("PredictionMarket");
    const PredictionMarketFactory = await deployments.get("PredictionMarketFactory");
    const PredictionMarketNWay = await deployments.get("PredictionMarketNWay");
    const PredictionMarketFactoryNWay = await deployments.get("PredictionMarketFactoryNWay");
    const MintableERC20 = await deployments.get("MintableERC20");

    const frontendAbiDir = path.resolve(__dirname, "../../prediction-market-nodejs/abi");

    if (!fs.existsSync(frontendAbiDir)) {
        fs.mkdirSync(frontendAbiDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(frontendAbiDir, "PredictionMarket.json"),
        JSON.stringify(PredictionMarket.abi, null, 2)
    );

    fs.writeFileSync(
        path.join(frontendAbiDir, "PredictionMarketFactory.json"),
        JSON.stringify(PredictionMarketFactory.abi, null, 2)
    );

    fs.writeFileSync(
        path.join(frontendAbiDir, "PredictionMarketNWay.json"),
        JSON.stringify(PredictionMarketNWay.abi, null, 2)
    );

    fs.writeFileSync(
        path.join(frontendAbiDir, "PredictionMarketFactoryNWay.json"),
        JSON.stringify(PredictionMarketFactoryNWay.abi, null, 2)
    );

    fs.writeFileSync(
        path.join(frontendAbiDir, "MintableERC20.json"),
        JSON.stringify(MintableERC20.abi, null, 2)
    );

    const contractAddresses = {
        PredictionMarket: PredictionMarket.address,
        PredictionMarketFactory: PredictionMarketFactory.address,
        PredictionMarketNWay: PredictionMarketNWay.address,
        PredictionMarketFactoryNWay: PredictionMarketFactoryNWay.address,
        MintableERC20: MintableERC20.address,
    };

    fs.writeFileSync(
        path.join(frontendAbiDir, "contract-addresses.json"),
        JSON.stringify(contractAddresses, null, 2)
    );

    console.log("Front end written!");
};

module.exports.tags = ["all", "frontend"];

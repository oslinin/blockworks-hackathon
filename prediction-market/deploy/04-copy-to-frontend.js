const fs = require("fs");
const path = require("path");

module.exports = async ({ deployments }) => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...");

        const PredictionMarket = await deployments.get("PredictionMarket");
        const PredictionMarketFactory = await deployments.get("PredictionMarketFactory");

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

        const contractAddresses = {
            PredictionMarket: PredictionMarket.address,
            PredictionMarketFactory: PredictionMarketFactory.address,
        };

        fs.writeFileSync(
            path.join(frontendAbiDir, "contract-addresses.json"),
            JSON.stringify(contractAddresses, null, 2)
        );

        console.log("Front end written!");
    }
};

module.exports.tags = ["all", "frontend"];

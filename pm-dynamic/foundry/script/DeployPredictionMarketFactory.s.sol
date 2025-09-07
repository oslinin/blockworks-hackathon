// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {PredictionMarketFactoryFixedModel} from "../src/PredictionMarketFactoryFixedModel.sol";

contract DeployPredictionMarketFactory is Script {
    function run() external returns (PredictionMarketFactoryFixedModel) {
        vm.startBroadcast();
        PredictionMarketFactoryFixedModel factory = new PredictionMarketFactoryFixedModel();
        vm.stopBroadcast();
        return factory;
    }
}

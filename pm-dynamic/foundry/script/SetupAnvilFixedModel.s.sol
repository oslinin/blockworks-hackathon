// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {PredictionMarketFactoryFixedModel} from "../src/PredictionMarketFactoryFixedModel.sol";
import {PredictionMarketFixedModel} from "../src/PredictionMarketFixedModel.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {Strings} from "@openzeppelin-contracts/contracts/utils/Strings.sol";

contract SetupAnvilFixedModel is Script {
    function run() external {
        vm.startBroadcast();
        MockUSDC usdc = new MockUSDC();
        PredictionMarketFactoryFixedModel factory = new PredictionMarketFactoryFixedModel();
        vm.stopBroadcast();

        console.log("USDC deployed at: ", address(usdc));
        console.log("PredictionMarketFactoryFixedModel deployed at: ", address(factory));

        address oracle = 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B; // Vitalik Buterin's address as a placeholder

        vm.startBroadcast();
        for (uint i = 0; i < 10; i++) {
            string memory question = string(abi.encodePacked("random bet ", Strings.toString(i)));
            address marketAddress = factory.createMarket(
                question,
                PredictionMarketFixedModel.Category.SPORTS, // Using a default category
                oracle,
                address(usdc)
            );
            console.log("Created market at address:", marketAddress);
        }
        vm.stopBroadcast();
    }
}

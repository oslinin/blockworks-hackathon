// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {SimpleStorage} from "../src/SimpleStorage.sol";

contract DeploySimpleStorage is Script {
    function run() external returns (SimpleStorage) {
        vm.startBroadcast(); //foundry cheat codes.  Send everything to RPC, pay gas

        SimpleStorage simpleStorage = new SimpleStorage(); //new creates news contract
        //SimpleStorage simpleStorage = new SimpleStorage{value: 1 ether}();  //new creates news contract

        vm.stopBroadcast();
        return simpleStorage;
    }
}

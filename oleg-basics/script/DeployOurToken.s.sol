// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {Token} from "../contracts/Token.sol";

contract DeployToken is Script {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 ether; // 1 million tokens with 18 decimal places

    function run() external returns (Token) {
        vm.startBroadcast();
        Token ourToken = new Token("Token", "TOK", INITIAL_SUPPLY);
        vm.stopBroadcast();
        return ourToken;
    }
}

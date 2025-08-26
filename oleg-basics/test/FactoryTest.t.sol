// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {DeployToken} from "../script/DeployOurToken.s.sol";
import {Token} from "../contracts/Token.sol";
import {Exchange} from "../contracts/Exchange.sol";
import {Factory} from "../contracts/Factory.sol";
import {Test, console} from "forge-std/Test.sol";
import {ZkSyncChainChecker} from "lib/foundry-devops/src/ZkSyncChainChecker.sol";

interface MintableToken {
    function mint(address, uint256) external;
}

contract TokenTest is Test, ZkSyncChainChecker {
    uint256 BOB_STARTING_AMOUNT = 100 ether;
    uint256 public constant INITIAL_SUPPLY = 1_000 ether; // 1 million tokens with 18 decimal places

    Token public ourToken;
    Exchange public exchange;
    DeployToken public deployer;
    Factory public factory;
    address public deployerAddress;
    address exchangeAddress;
    address bob;
    address alice;

    function setUp() public {
        deployer = new DeployToken();
        if (!isZkSyncChain()) {
            ourToken = deployer.run();
        } else {
            ourToken = new Token("Token", "TOK", INITIAL_SUPPLY);
            ourToken.transfer(msg.sender, INITIAL_SUPPLY);
        }

        factory = new Factory();

        exchangeAddress = factory.createExchange(address(ourToken));

        // Attach to the exchange contract using the address
        exchange = Exchange(exchangeAddress);
    }

    function testCreateExchange() public {
        assertEq(factory.tokenToExchange(address(ourToken)), exchangeAddress);

        // Attach to the exchange contract using the address
        exchange = Exchange(exchangeAddress);

        // Now you can interact with the exchange contract
        assertEq(exchange.name(), "Zuniswap-V1");
        assertEq(exchange.symbol(), "ZUNI-V1");
        assertEq(exchange.factoryAddress(), address(factory));
        assertEq(factory.getExchange(address(ourToken)), exchangeAddress);
    }

    function testCannotCreateExchangeWithZeroAddress() public {
        // Expect a revert with the message "invalid token address"
        vm.expectRevert(bytes("invalid token address")); //passes

        // Call the function that should revert
        factory.createExchange(address(0));
    }

    function testFailWhenExchangeExists() public {
        // Expect the next attempt to create an exchange for the same token to revert

        vm.expectRevert(
            abi.encodeWithSelector(
                Factory.Factory__exchangeAlreadyExists.selector,
                ourToken
            )
        );

        exchangeAddress = factory.getExchange(address(ourToken));

        factory.createExchange(address(ourToken));
    }
}

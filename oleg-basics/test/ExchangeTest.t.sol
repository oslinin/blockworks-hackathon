// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {DeployToken} from "../script/DeployOurToken.s.sol";
import {Token} from "../contracts/Token.sol";
import {Exchange} from "../contracts/Exchange.sol";
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
    address public deployerAddress;
    address bob;
    address alice;

    function setUp() public {
        deployer = new DeployToken();
        deployerAddress = msg.sender;
        if (!isZkSyncChain()) {
            ourToken = deployer.run();
        } else {
            ourToken = new Token("Token", "TOK", INITIAL_SUPPLY);
            ourToken.transfer(msg.sender, INITIAL_SUPPLY);
        }

        vm.startBroadcast(); //actually deploy, else static call
        assertGt(ourToken.balanceOf(deployerAddress), 200 ether);
        assertEq(ourToken.balanceOf(deployerAddress) / 1000, INITIAL_SUPPLY);

        exchange = new Exchange(address(ourToken));

        uint256 allowance = ourToken.allowance(
            deployerAddress,
            address(exchange)
        ); //doesn't work, says it's 0, but approve succeeded
        console.log("Allowance for Exchange:", allowance);
        // assertEq(allowance, 200 ether); // Ensure that allowance is exactly 200 ether

        // ourToken.approve(address(exchange), 200 ether);
        // console.log(msg.sender);
        assert(address(exchange) != address(0));

        // ourToken.approve(address(exchange), 200 ether);
        // exchange.addLiquidity{value: 100 ether}(200 ether);
        vm.stopBroadcast();
    }

    function testExchangeIsDeployed() public view {
        console.log(address(exchange));
        // Ensure that the exchange is deployed
        assert(address(exchange) != address(0));
        // Check the name of the exchange
        assertEq(exchange.name(), "Zuniswap-V1");
        // Check the symbol of the exchange
        assertEq(exchange.symbol(), "ZUNI-V1");
        // Check the total supply is zero initially
        // assertEq(exchange.totalSupply(), 0);
        // Check that the   ory address is set correctly
        // assertEq(
        //     exchange.factoryAddress(),
        //     address(factory)
        // );
    }

    function testAddLiquidity() public {
        assertEq(msg.sender, deployerAddress);
        console.log(deployerAddress);
        // console.log(msg.sender);
        // vm.deal(deployerAddress, 200 ether);

        console.log(ourToken.balanceOf(deployerAddress) / 1e21);
        console.log(address(deployerAddress).balance / 1e18);
        assertGt(address(deployerAddress).balance, 100 ether);
        assertGt(ourToken.balanceOf(deployerAddress), 200 ether);

        // vm.prank(deployerAddress); //fails
        vm.startBroadcast(); //without this transfer throws insufficentAllowance.
        ourToken.approve(address(exchange), 200 ether);
        // vm.prank(deployerAddress); //fails

        exchange.addLiquidity{value: 100 ether}(200 ether);
        vm.stopBroadcast();

        assertEq(exchange.balanceOf(deployerAddress), 100 ether);
        assertEq(exchange.totalSupply(), 100 ether);
    }

    function testAllowsZeroAmounts() public {
        vm.startBroadcast();
        ourToken.approve(address(exchange), 0);
        exchange.addLiquidity{value: 0}(0);
        vm.stopBroadcast();

        assertEq(exchange.balanceOf(deployerAddress), 0);
        assertEq(exchange.getReserve(), 0);
    }

    function testExistingReserves() public {
        vm.startBroadcast(); //without this transfer throws insufficentAllowance.

        ourToken.approve(address(exchange), 300 ether);
        exchange.addLiquidity{value: 100 ether}(200 ether);
        assertEq(exchange.totalSupply(), 100 ether);
        //prserve e
        exchange.addLiquidity{value: 50 ether}(200 ether);
        assertEq(address(exchange).balance, 150 ether);
        assertEq(exchange.totalSupply(), 150 ether);

        vm.expectRevert();
        // Exchange.Exchange__ERC20InsufficientTokenAmount.selector
        //fails when not enough tokens
        exchange.addLiquidity{value: 100 ether}(200 ether);

        vm.stopBroadcast();
    }

    function testRemoveLiquidity() public {
        vm.startBroadcast(); //without this transfer throws insufficentAllowance.

        ourToken.approve(address(exchange), 300 ether);
        exchange.addLiquidity{value: 100 ether}(200 ether);
        // removes some liquidity

        uint256 userEtherBalanceBefore = deployerAddress.balance;
        uint256 userTokenBalanceBefore = ourToken.balanceOf(deployerAddress);

        exchange.removeLiquidity(25 ether);

        uint256 userEtherBalanceAfter = deployerAddress.balance;
        uint256 userTokenBalanceAfter = ourToken.balanceOf(deployerAddress);

        assertEq(userEtherBalanceAfter - userEtherBalanceBefore, 25 ether);
        assertEq(userTokenBalanceAfter - userTokenBalanceBefore, 50 ether);
        vm.stopBroadcast();
    }

    function testRemoveAllLiquidity() public {
        vm.startBroadcast(); //without this transfer throws insufficentAllowance.

        ourToken.approve(address(exchange), 300 ether);
        exchange.addLiquidity{value: 100 ether}(200 ether);
        // removes some liquidity

        uint256 userEtherBalanceBefore = deployerAddress.balance;
        uint256 userTokenBalanceBefore = ourToken.balanceOf(deployerAddress);

        exchange.removeLiquidity(100 ether);

        uint256 userEtherBalanceAfter = deployerAddress.balance;
        uint256 userTokenBalanceAfter = ourToken.balanceOf(deployerAddress);

        assertEq(userEtherBalanceAfter - userEtherBalanceBefore, 100 ether);
        assertEq(userTokenBalanceAfter - userTokenBalanceBefore, 200 ether);
        vm.stopBroadcast();
    }

    /**
     * put in 200 token, 100 eth.
     *      deployer ETH/TOK = 900/800
     *      exchange reserve/balance/supply = 200/100/100
     * swap 10 eth for at least 18 ourTokens
     * remove 100 liquidity tokens
     *
     */
    function testPaysForProvidedLiquidity() public {
        startHoax(deployerAddress, 1_000 ether);
        uint256 tok0 = INITIAL_SUPPLY * 1000;
        assertEq(ourToken.balanceOf(deployerAddress), tok0);

        ourToken.approve(address(exchange), 300 ether);
        exchange.addLiquidity{value: 100 ether}(200 ether);

        assertEq(deployerAddress.balance, 900 ether);
        assertEq(ourToken.balanceOf(deployerAddress), tok0 - 200 ether);
        assertEq(address(exchange).balance, 100 ether);
        assertEq(exchange.getReserve(), 200 ether);
        assertEq(exchange.totalSupply(), 100 ether);

        uint256 got = exchange.ethToTokenSwap{value: 10 ether}(18 ether);

        assertEq(deployerAddress.balance, 890 ether);
        assertEq(ourToken.balanceOf(deployerAddress), tok0 - 200 ether + got);
        assertEq(address(exchange).balance, 110 ether);
        assertEq(exchange.getReserve(), 200 ether - got);
        assertEq(exchange.totalSupply(), 100 ether);

        // uint256 userTokenBalanceBefore = ourToken.balanceOf(deployerAddress);
        exchange.removeLiquidity(100 ether);

        assertEq(exchange.getReserve(), 0); //token balance of exchange
        assertEq(exchange.balanceOf(deployerAddress), 0); //eth balance of exchg
        assertEq(deployerAddress.balance, 890 ether + 110 ether);
        assertEq(
            ourToken.balanceOf(deployerAddress),
            tok0 - 200 ether + got + 200 ether - got
        );
    }

    function testLPBurns() public {
        startHoax(deployerAddress, 1_000 ether);
        uint256 tok0 = INITIAL_SUPPLY * 1000;
        assertEq(ourToken.balanceOf(deployerAddress), tok0);

        ourToken.approve(address(exchange), 300 ether);
        exchange.addLiquidity{value: 100 ether}(200 ether);

        // Test LP token burning
        uint256 initialBalance = exchange.balanceOf(deployerAddress);
        uint256 initialTotalSupply = exchange.totalSupply();

        exchange.removeLiquidity(25 ether);

        uint256 finalBalance = exchange.balanceOf(deployerAddress);
        uint256 finalTotalSupply = exchange.totalSupply();

        assertEq(
            finalBalance,
            initialBalance - 25 ether,
            "LP token balance should decrease by 25 ether"
        );
        assertEq(
            finalTotalSupply,
            initialTotalSupply - 25 ether,
            "Total supply should decrease by 25 ether"
        );
        assertEq(
            finalTotalSupply,
            75 ether,
            "Final total supply should be 75 ether"
        );
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/PredictionMarketFactoryFixedModel.sol";
import "../src/MockUSDC.sol";

contract PredictionMarketFactoryFixedModelTest is Test {
    PredictionMarketFactoryFixedModel internal factory;
    MockUSDC internal usdc;
    address internal oracle;

    event PredictionMarketFactoryFixedModel__MarketCreatedFixedModel(
        address indexed marketAddress,
        address indexed creator,
        string question,
        PredictionMarketFixedModel.Category category,
        address oracle,
        address usdcToken,
        uint256 marketId
    );

    function setUp() public {
        usdc = new MockUSDC();
        factory = new PredictionMarketFactoryFixedModel();
        oracle = makeAddr("oracle");
    }

    function testCreateMarket() public {
        vm.expectEmit(false, true, true, true, address(factory));
        emit PredictionMarketFactoryFixedModel__MarketCreatedFixedModel(
            address(0), // The market address is unknown, so we check for any address
            address(this),
            "Will the ETH merge be delayed?",
            PredictionMarketFixedModel.Category.CRYPTO,
            oracle,
            address(usdc),
            0
        );
        factory.createMarket(
            "Will the ETH merge be delayed?",
            PredictionMarketFixedModel.Category.CRYPTO,
            oracle,
            address(usdc)
        );

        PredictionMarketFixedModel[] memory fixedMarkets = factory.getAllFixedModelMarkets();
        assertEq(fixedMarkets.length, 1);
    }
}

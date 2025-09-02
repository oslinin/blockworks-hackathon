// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarketNWay.sol";

contract PredictionMarketFactoryNWay {
    address[] public markets;
    mapping(PredictionMarketNWay.Category => address[]) public marketsByCategory;

    event MarketCreated(address indexed marketAddress, string question, PredictionMarketNWay.Category category);

    function createMarket(
        string memory _question,
        PredictionMarketNWay.Category _category,
        address _oracle,
        address _usdcToken,
        string[] memory _outcomeNames,
        string[] memory _outcomeSymbols,
        uint256 _initialLiquidity
    ) external {
        PredictionMarketNWay newMarket = new PredictionMarketNWay(
            _question,
            _category,
            _oracle,
            _usdcToken,
            _outcomeNames,
            _outcomeSymbols,
            _initialLiquidity
        );
        
        address marketAddress = address(newMarket);
        markets.push(marketAddress);
        marketsByCategory[_category].push(marketAddress);

        emit MarketCreated(marketAddress, _question, _category);
    }

    function getAllMarkets() external view returns (address[] memory) {
        return markets;
    }

    function getMarketsByCategory(PredictionMarketNWay.Category _category) external view returns (address[] memory) {
        return marketsByCategory[_category];
    }
}

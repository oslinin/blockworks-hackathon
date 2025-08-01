// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarketNWayFixedModel.sol";

contract PredictionMarketFactoryNWayFixedModel {
    PredictionMarketNWayFixedModel[] public predictionMarketsNWayFixedModel;
    
    event MarketCreatedNWayFixedModel(address indexed marketAddress, string question, PredictionMarketNWayFixedModel.Category category);

    function createMarket(
        string memory _question,
        PredictionMarketNWayFixedModel.Category _category,
        address _oracle,
        address _usdcToken,
        uint256 _numOutcomes
    ) public returns (address) {
        PredictionMarketNWayFixedModel newMarket = new PredictionMarketNWayFixedModel(
            _question,
            _category,
            _oracle,
            _usdcToken,
            _numOutcomes
        );
        
        newMarket.transferOwnership(msg.sender);

        predictionMarketsNWayFixedModel.push(newMarket);
        emit MarketCreatedNWayFixedModel(address(newMarket), _question, _category);
        return address(newMarket);
    }

    function getAllNWayFixedModelMarkets() public view returns (PredictionMarketNWayFixedModel[] memory) {
        return predictionMarketsNWayFixedModel;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarketFixedModel.sol";

contract PredictionMarketFactoryFixedModel {
    PredictionMarketFixedModel[] public predictionMarketsFixedModel;
    
    event MarketCreatedFixedModel(address indexed marketAddress, string question, PredictionMarketFixedModel.Category category);

    function createMarket(
        string memory _question,
        PredictionMarketFixedModel.Category _category,
        address _oracle,
        address _usdcToken
    ) public returns (address) {
        PredictionMarketFixedModel newMarket = new PredictionMarketFixedModel(
            _question,
            _category,
            _oracle,
            _usdcToken
        );
        
        newMarket.transferOwnership(msg.sender);

        predictionMarketsFixedModel.push(newMarket);
        emit MarketCreatedFixedModel(address(newMarket), _question, _category);
        return address(newMarket);
    }

    function getAllFixedModelMarkets() public view returns (PredictionMarketFixedModel[] memory) {
        return predictionMarketsFixedModel;
    }
}

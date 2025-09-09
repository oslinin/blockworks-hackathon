// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PredictionMarketFixedModel} from "./PredictionMarketFixedModel.sol";

contract PredictionMarketFactoryFixedModel {
    mapping(uint256 => PredictionMarketFixedModel)
        public predictionMarketsFixedModel;
    uint256 public marketCount;

    event PredictionMarketFactoryFixedModel__MarketCreatedFixedModel(
        address indexed marketAddress,
        address indexed creator,
        string question,
        PredictionMarketFixedModel.Category category,
        address oracle,
        address usdcToken,
        uint256 marketId
    );

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

        predictionMarketsFixedModel[marketCount] = newMarket;
        emit PredictionMarketFactoryFixedModel__MarketCreatedFixedModel(
            address(newMarket),
            msg.sender,
            _question,
            _category,
            _oracle,
            _usdcToken,
            marketCount
        );
        marketCount++;
        return address(newMarket);
    }

    function getAllFixedModelMarkets()
        public
        view
        returns (PredictionMarketFixedModel[] memory)
    {
        PredictionMarketFixedModel[]
            memory allMarkets = new PredictionMarketFixedModel[](marketCount);
        for (uint256 i = 0; i < marketCount; i++) {
            allMarkets[i] = predictionMarketsFixedModel[i];
        }
        return allMarkets;
    }

    function getMarketCount() public view returns (uint256) {
        return marketCount;
    }
}

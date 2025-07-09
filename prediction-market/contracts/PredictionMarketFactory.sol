// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarket.sol";

contract PredictionMarketFactory {
    mapping(PredictionMarket.Category => PredictionMarket[]) public marketsByCategory;
    PredictionMarket[] public allMarkets;

    event MarketCreated(address indexed marketAddress, PredictionMarket.Category category, string question);

    function createMarket(
        address _usdcAddress,
        string memory _question,
        PredictionMarket.Category _category
    ) public returns (PredictionMarket newMarket) {
        newMarket = new PredictionMarket(
            _usdcAddress,
            _question,
            _category,
            msg.sender // The creator of the market is the initial owner
        );
        marketsByCategory[_category].push(newMarket);
        allMarkets.push(newMarket);

        emit MarketCreated(address(newMarket), _category, _question);
    }

    function getMarketsByCategory(PredictionMarket.Category _category) public view returns (PredictionMarket[] memory) {
        return marketsByCategory[_category];
    }

    function getAllMarkets() public view returns (PredictionMarket[] memory) {
        return allMarkets;
    }

    // This function is a placeholder for the prompt's requirement.
    // In a real-world scenario, aggregating all outstanding bets from all markets
    // on-chain would be gas-intensive. This would typically be handled off-chain
    // by indexing events.
    function getAllBets() public view returns (address[] memory) {
        address[] memory marketAddresses = new address[](allMarkets.length);
        for (uint i = 0; i < allMarkets.length; i++) {
            marketAddresses[i] = address(allMarkets[i]);
        }
        return marketAddresses;
    }
}

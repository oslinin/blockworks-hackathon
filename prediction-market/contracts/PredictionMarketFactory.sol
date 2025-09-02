// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarket.sol";
import "./MintableERC20.sol";

contract PredictionMarketFactory {
    PredictionMarket[] public predictionMarkets;
    
    event MarketCreated(address indexed marketAddress, string question, PredictionMarket.Category category);
    event BetPlaced(address indexed user, address indexed marketAddress, uint256 amount, bool onYes);

    function createMarket(
        string memory _question,
        PredictionMarket.Category _category,
        address _oracle,
        address _usdcToken,
        string memory _yesTokenName,
        string memory _yesTokenSymbol,
        string memory _noTokenName,
        string memory _noTokenSymbol,
        uint256 _initialLiquidity
    ) public returns (address) {
        MintableERC20 yesToken = new MintableERC20(_yesTokenName, _yesTokenSymbol);
        MintableERC20 noToken = new MintableERC20(_noTokenName, _noTokenSymbol);

        PredictionMarket newMarket = new PredictionMarket(
            _question,
            _category,
            _oracle,
            _usdcToken,
            address(yesToken),
            address(noToken)
        );
        
        // The factory is the initial owner of the market and tokens.
        // We transfer the ownership of the tokens to the market so it can mint the initial liquidity
        yesToken.transferOwnership(address(newMarket));
        noToken.transferOwnership(address(newMarket));

        // Initialize the market to mint liquidity.
        newMarket.initialize(_initialLiquidity);

        // Transfer ownership of the market to the user who created it.
        newMarket.transferOwnership(msg.sender);

        predictionMarkets.push(newMarket);
        emit MarketCreated(address(newMarket), _question, _category);
        return address(newMarket);
    }

    function getAllMarkets() public view returns (PredictionMarket[] memory) {
        return predictionMarkets;
    }

    function getMarketsByCategory(PredictionMarket.Category _category) public view returns (PredictionMarket[] memory) {
        uint count = 0;
        for (uint i = 0; i < predictionMarkets.length; i++) {
            if (predictionMarkets[i].category() == _category) {
                count++;
            }
        }

        PredictionMarket[] memory categoryMarkets = new PredictionMarket[](count);
        uint index = 0;
        for (uint i = 0; i < predictionMarkets.length; i++) {
            if (predictionMarkets[i].category() == _category) {
                categoryMarkets[index] = predictionMarkets[i];
                index++;
            }
        }
        return categoryMarkets;
    }
}

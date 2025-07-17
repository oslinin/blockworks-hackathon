# Prediction Market Smart Contracts

This project contains the Solidity smart contracts for a prediction market.

It uses [Hardhat](https://hardhat.org/) for development and testing.

## Getting Started

1.  Install dependencies:
    ```bash
    yarn install
    ```

2.  Compile the contracts:
    ```bash
    yarn hardhat compile
    ```

## Usage

*   Run tests:
    ```bash
    yarn hardhat test
    ```

*   Start a local Hardhat node:
    ```bash
    yarn hardhat node
    ```

*   Deploy the contracts to a local network:
    ```bash
    yarn hardhat deploy --network localhost
    ```

## Contracts

### `MintableERC20.sol`

A standard ERC20 token with an added `mint` function, allowing the contract owner to create new tokens.

**Functions:**
- `mint(address to, uint256 amount)`: Creates `amount` new tokens and assigns them to the `to` address. Only callable by the owner.

### `PredictionMarket.sol`

The core contract for a single prediction market with a binary outcome (YES/NO). It manages the automated market maker (AMM), allows users to bet, and handles the resolution and claiming of funds.

**Public Variables:**
- `usdcToken`: The ERC20 token used for betting (e.g., USDC).
- `yesToken`: The ERC20 token representing a "YES" outcome.
- `noToken`: The ERC20 token representing a "NO" outcome.
- `K`: The constant product for the AMM.
- `category`: The market's category (e.g., ELECTION, SPORTS).
- `question`: The question the market is predicting.
- `oracle`: The address responsible for resolving the market.
- `resolved`: A boolean indicating if the market has been resolved.
- `outcome`: The final outcome of the market (true for YES, false for NO).

**Functions:**
- `initialize()`: Mints the initial liquidity for the AMM.
- `getProbability()`: Returns the current probability of a "YES" outcome, based on the token balances in the AMM.
- `bet(uint256 amount, bool onYes)`: Allows a user to bet `amount` of USDC on a "YES" or "NO" outcome.
- `resolve(bool _outcome)`: Resolves the market with a final outcome. Only callable by the oracle.
- `claim()`: Allows users to claim their winnings after the market has been resolved.

### `PredictionMarketFactory.sol`

A factory contract for creating new `PredictionMarket` instances.

**Functions:**
- `createMarket(...)`: Deploys and initializes a new `PredictionMarket` contract with the specified parameters.
- `getAllMarkets()`: Returns an array of all created `PredictionMarket` contract addresses.
- `getMarketsByCategory(PredictionMarket.Category _category)`: Returns an array of all markets within a specific category.

### `PredictionMarketNWay.sol`

A contract for a prediction market with multiple possible outcomes (N-way).

**Public Variables:**
- `usdcToken`: The ERC20 token used for betting.
- `outcomeTokens`: An array of ERC20 tokens, each representing a possible outcome.
- `category`: The market's category.
- `question`: The question the market is predicting.
- `oracle`: The address responsible for resolving the market.
- `resolved`: A boolean indicating if the market has been resolved.
- `winningOutcome`: The index of the winning outcome.

**Functions:**
- `getProbabilities()`: Returns an array of probabilities for each outcome.
- `bet(uint256 amount, uint256 outcomeIndex)`: Allows a user to bet `amount` of USDC on a specific outcome.
- `resolve(uint256 _winningOutcome)`: Resolves the market with a final outcome. Only callable by the oracle.
- `claim()`: Allows users to claim their winnings after the market has been resolved.

### `PredictionMarketFactoryNWay.sol`

A factory contract for creating new `PredictionMarketNWay` instances.

**Functions:**
- `createMarket(...)`: Deploys and initializes a new `PredictionMarketNWay` contract.
- `getAllMarkets()`: Returns an array of all created `PredictionMarketNWay` contract addresses.
- `getMarketsByCategory(...)`: Returns an array of all N-way markets within a specific category.

## Testing

The project includes a comprehensive test suite to ensure the correctness of the smart contracts.

### `test/test.predictionmarket.js`

This file tests the functionality of the `PredictionMarket.sol` contract. It covers:
- **Initial State:** Checks if the market is initialized with the correct liquidity and probability (50%).
- **Betting:** Tests the `bet` function with various scenarios, ensuring the AMM logic is correctly implemented and that users receive the correct amount of outcome tokens.
- **Probability Calculation:** Verifies that the `getProbability` function returns the correct probability after bets are placed.
- **Resolution:** Ensures that the market can be resolved by the oracle and that the `resolved` and `outcome` variables are set correctly.

### `test/testPredictionMarketFactory.js`

This file tests the `PredictionMarketFactory.sol` contract. It covers:
- **Market Creation:** Ensures that the factory can create new `PredictionMarket` instances and that the `MarketCreated` event is emitted.
- **Market Categorization:** Verifies that the `getMarketsByCategory` function correctly returns markets based on their category.

### `test/testPredictionMarketNWay.js`

This file tests the `PredictionMarketNWay.sol` contract. It covers:
- **Initial State:** Checks if the N-way market is initialized with the correct number of outcome tokens, liquidity, and initial probabilities.
- **Betting:** Tests the `bet` function to ensure that users can bet on different outcomes and that the token balances are updated correctly.
- **Resolution:** Verifies that the market can be resolved by the oracle with a specific winning outcome.

### `test/testPredictionMarketFactoryNWay.js`

This file tests the `PredictionMarketFactoryNWay.sol` contract. It covers:
- **Market Creation:** Ensures that the factory can create new `PredictionMarketNWay` instances.
- **Market Categorization:** Verifies that the `getMarketsByCategory` function correctly returns N-way markets based on their category.
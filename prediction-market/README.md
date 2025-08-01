# Gemini - Prediction Market Backend

This document provides an overview of the prediction market smart contracts, the development environment, and key scripts.

## Key Technologies

*   **Solidity**: The language used for writing the smart contracts.
*   **Hardhat**: The development environment for compiling, testing, and deploying the contracts.
*   **OpenZeppelin Contracts**: Used for standard and secure contract implementations (e.g., ERC20).
*   **PRBMath**: A library for advanced fixed-point math operations, used in the AMM model.

## Directory Structure

```
.
├── contracts/
│   ├── PredictionMarket.sol
│   ├── PredictionMarketFactory.sol
│   ├── PredictionMarketNWay.sol
│   ├── PredictionMarketFactoryNWay.sol
│   ├── PredictionMarketFixedModel.sol
│   ├── PredictionMarketFactoryFixedModel.sol
│   └── MintableERC20.sol
├── deploy/
├── test/
│   ├── unit/
│   │   ├── test.predictionmarket.js
│   │   ├── testPredictionMarketFactory.js
│   │   ├── testPredictionMarketNWay.js
│   │   ├── testPredictionMarketFactoryNWay.js
│   │   ├── test.predictionmarket-fixedmodel.js
│   │   └── test.predictionmarket-factory-fixedmodel.js
│   └── staging/
├── scripts/
├── utils/
├── hardhat.config.js
└── package.json
```

## Smart Contract Functions

### `PredictionMarket.sol` (AMM)

The core contract for a binary prediction market using an Automated Market Maker.

*   `initialize()`: Mints the initial liquidity for the AMM.
*   `getProbability()`: Returns the current probability of a "YES" outcome.
*   `bet(uint256 amount, bool onYes)`: Allows a user to bet on a "YES" or "NO" outcome.
*   `resolve(bool _outcome)`: Resolves the market. Only callable by the oracle.
*   `claim()`: Allows users to claim their winnings.

### `PredictionMarketFactory.sol`

A factory for creating `PredictionMarket` (AMM) instances.

*   `createMarket(...)`: Deploys a new `PredictionMarket` contract.
*   `getAllMarkets()`: Returns all created `PredictionMarket` addresses.

### `PredictionMarketNWay.sol` (AMM)

A contract for a prediction market with multiple outcomes.

*   `getProbabilities()`: Returns an array of probabilities for each outcome.
*   `bet(uint256 amount, uint256 outcomeIndex)`: Allows a user to bet on a specific outcome.
*   `resolve(uint256 _winningOutcome)`: Resolves the market. Only callable by the oracle.
*   `claim()`: Allows users to claim their winnings.

### `PredictionMarketFactoryNWay.sol`

A factory for creating `PredictionMarketNWay` (AMM) instances.

*   `createMarket(...)`: Deploys a new `PredictionMarketNWay` contract.
*   `getAllMarkets()`: Returns all created `PredictionMarketNWay` addresses.

### `PredictionMarketFixedModel.sol`

A contract for a binary prediction market using a fixed-odds model.

*   `bet(bool onYes)`: Allows a user to place a 1 USDC bet on a "YES" or "NO" outcome.
*   `resolve(bool _outcome)`: Resolves the market. Only callable by the oracle.
*   `claim()`: Allows users to claim their winnings based on the ratio of total bets.

### `PredictionMarketFactoryFixedModel.sol`

A factory for creating `PredictionMarketFixedModel` instances.

*   `createMarket(...)`: Deploys a new `PredictionMarketFixedModel` contract.
*   `getAllFixedModelMarkets()`: Returns all created `PredictionMarketFixedModel` addresses.

## Commands

*   **Compile contracts:**
    ```bash
    yarn hardhat compile
    ```
*   **Run tests:**
    ```bash
    yarn hardhat test
    ```
*   **Start a local node:**
    ```bash
    yarn hardhat node
    ```
*   **Deploy contracts:**
    ```bash
    yarn hardhat deploy --network localhost
    ```

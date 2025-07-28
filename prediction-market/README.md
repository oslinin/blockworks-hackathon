# Gemini - Prediction Market Backend

This document provides an overview of the prediction market smart contracts, the development environment, and key scripts.

## Key Technologies

*   **Solidity**: The language used for writing the smart contracts.
*   **Hardhat**: The development environment for compiling, testing, and deploying the contracts.
*   **OpenZeppelin Contracts**: Used for standard and secure contract implementations (e.g., ERC20).
*   **PRBMath**: A library for advanced fixed-point math operations.

## Project Structure

*   **`contracts/`**: Contains the Solidity source code for the smart contracts.
    *   `PredictionMarket.sol`: The core contract for binary (YES/NO) prediction markets.
    *   `PredictionMarketFactory.sol`: A factory for creating `PredictionMarket` instances.
    *   `PredictionMarketNWay.sol`: A contract for markets with multiple outcomes.
    *   `PredictionMarketFactoryNWay.sol`: A factory for creating `PredictionMarketNWay` instances.
    *   `MintableERC20.sol`: A standard ERC20 token with a minting function.
*   **`deploy/`**: Contains scripts for deploying the contracts.
*   **`test/`**: Contains the test suite for the smart contracts.
*   **`utils/`**: Contains utility scripts, such as `verify.js` for verifying contracts on Etherscan.
*   **`scripts/`**: Contains scripts for interacting with the contracts, such as `createSampleMarket.js` for creating a new prediction market and `deployFactory.js` for deploying the `PredictionMarketFactory` contract.
*   **`hardhat.config.js`**: The configuration file for Hardhat.

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

## File Structure

```
.
├── artifacts
├── cache
├── contracts
│   ├── MintableERC20.sol
│   ├── PredictionMarket.sol
│   ├── PredictionMarketFactory.sol
│   ├── PredictionMarketFactoryNWay.sol
│   └── PredictionMarketNWay.sol
├── deploy
│   ├── 00-deploy-usdc.js
│   ├── 01-deploy-predictionmarket-factory.js
│   ├── 02-deploy-predictionmarket-factory-nway.js
│   ├── 02-deploy-predictionmarket.js
│   ├── 03-deploy-predictionmarket-nway.js
│   └── 04-copy-to-frontend.js
├── deployments
│   ├── localhost
│   └── sepolia
├── ignition
├── scripts
│   ├── createSampleMarket.js
│   └── deployFactory.js
├── tasks
│   └── mint-usdc.js
├── test
│   ├── staging
│   │   ├── test.predictionmarket.staging.js
│   │   └── test.usdc.interaction.js
│   └── unit
│       ├── test.predictionmarket.js
│       ├── testPredictionMarketFactory.js
│       ├── testPredictionMarketFactoryNWay.js
│       └── testPredictionMarketNWay.js
├── utils
│   └── verify.js
├── .editorconfig
├── .env~
├── .gitattributes
├── .gitignore
├── .yarnrc.yml
├── #README.md#
├── hardhat.config.js
├── helper-hardhat-config.js
├── package.json
└── README.md
```

## Tests

### Staging Tests

*   **`test/staging/test.predictionmarket.staging.js`**:
    *   Tests the interaction with a live USDC contract on a forked mainnet.
    *   It impersonates a USDC whale to fund a test account.
    *   It checks if a user can successfully place a bet using real USDC.
*   **`test/staging/test.usdc.interaction.js`**:
    *   These tests run on a forked mainnet.
    *   It tests the full flow of creating a market, making a bet, and checking the probability changes.
    *   It also tests the market resolution.

### Unit Tests

*   **`test/unit/test.predictionmarket.js`**:
    *   Tests the core logic of the `PredictionMarket` contract.
    *   It checks the initial state of the market, including token balances and probability.
    *   It tests the betting mechanism and ensures the token amounts are calculated correctly.
    *   It verifies that the probability is updated correctly after each bet.
    *   It tests the market resolution logic.
*   **`test/unit/testPredictionMarketFactory.js`**:
    *   Tests the `PredictionMarketFactory` contract.
    *   It checks if the factory can create new prediction markets.
    *   It verifies that markets can be retrieved by their category.
*   **`test/unit/testPredictionMarketFactoryNWay.js`**:
    *   Tests the `PredictionMarketFactoryNWay` contract.
    *   It checks if the factory can create new N-way prediction markets.
    *   It verifies that N-way markets can be retrieved by their category.
*   **`test/unit/testPredictionMarketNWay.js`**:
    *   Tests the `PredictionMarketNWay` contract.
    *   It checks the initial state of the N-way market, including token balances and probabilities for each outcome.
    *   It tests the betting mechanism for N-way markets.
    *   It tests the market resolution for N-way markets.

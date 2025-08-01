# Gemini - YesNo Backend

This document provides an overview of the YesNo smart contracts, the development environment, and key scripts.

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

The core contract for a binary YesNo market using an Automated Market Maker.

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

A contract for a YesNo market with multiple outcomes.

*   `getProbabilities()`: Returns an array of probabilities for each outcome.
*   `bet(uint256 amount, uint256 outcomeIndex)`: Allows a user to bet on a specific outcome.
*   `resolve(uint256 _winningOutcome)`: Resolves the market. Only callable by the oracle.
*   `claim()`: Allows users to claim their winnings.

### `PredictionMarketFactoryNWay.sol`

A factory for creating `PredictionMarketNWay` (AMM) instances.

*   `createMarket(...)`: Deploys a new `PredictionMarketNWay` contract.
*   `getAllMarkets()`: Returns all created `PredictionMarketNWay` addresses.

### `PredictionMarketFixedModel.sol`

A contract for a binary YesNo market using a fixed-odds model.

*   `bet(bool onYes)`: Allows a user to place a 1 USDC bet on a "YES" or "NO" outcome.
*   `resolve(bool _outcome)`: Resolves the market. Only callable by the oracle.
*   `claim()`: Allows users to claim their winnings based on the ratio of total bets.

### `PredictionMarketFactoryFixedModel.sol`

A factory for creating `PredictionMarketFixedModel` instances.

*   `createMarket(...)`: Deploys a new `PredictionMarketFixedModel` contract.
*   `getAllFixedModelMarkets()`: Returns all created `PredictionMarketFixedModel` addresses.

## Testing

### `test/test.predictionmarket.js`

This file tests the `PredictionMarket.sol` contract. It covers:
- **Initial State:** Checks if the market is initialized with the correct liquidity, token addresses, and initial probability (50%).
- **Betting:** Tests the `bet` function to ensure that users can bet on "YES" or "NO" and that the token balances and probabilities are updated correctly.
- **Resolution:** Verifies that the market can be resolved by the oracle.

### `test/testPredictionMarketFactory.js`

This file tests the `PredictionMarketFactory.sol` contract. It covers:
- **Market Creation:** Ensures that the factory can create new `PredictionMarket` instances.
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

## Deployment

To deploy the contracts, you can use the `deploy` scripts in the `deploy/` directory. The deployment process also handles copying the contract ABIs and addresses to the frontend application.

### Localhost

To deploy to a local network, run:
```bash
yarn hardhat deploy --network localhost
```
This will deploy the contracts and write the ABI and address files to the `prediction-market-nodejs/abi/localhost/` directory.

### Sepolia Testnet

To deploy to the Sepolia testnet, ensure you have an `INFURA_API_KEY` and a `SEPOLIA_PRIVATE_KEY` set in your `.env` file. Then, run:
```bash
yarn hardhat deploy --network sepolia
```
This will deploy the contracts and write the ABI and address files to the `prediction-market-nodejs/abi/sepolia/` directory.

## Copying ABI to Frontend

The `04-copy-to-frontend.js` deploy script automatically copies the necessary ABI and address files to the frontend for the specified network. When you run `yarn hardhat deploy --network <network_name>`, the script creates a corresponding `<network_name>` directory inside `prediction-market-nodejs/abi/` and populates it with the contract data. This allows the frontend to dynamically load the correct contract information based on the selected network.
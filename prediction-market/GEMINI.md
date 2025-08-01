# Gemini - Prediction Market Backend

This document provides an overview of the prediction market smart contracts, the development environment, and key scripts.

## Project Overview

This project contains the Solidity smart contracts for a prediction market, built using Hardhat. It supports two types of market models:
- **Automated Market Maker (AMM):** Uses a constant product formula to determine token prices and probabilities.
- **Fixed-Model:** Uses a fixed-odds system where payouts are determined by the ratio of bets on each outcome.

## USDC Contract

<<<<<<< HEAD
*   **Solidity**: The language used for writing the smart contracts.
*   **Hardhat**: The development environment for compiling, testing, and deploying the contracts.
*   **OpenZeppelin Contracts**: Used for standard and secure contract implementations (e.g., ERC20).
*   **PRBMath**: A library for advanced fixed-point math operations, used in the AMM model.
=======
For development and testing on `localhost`, a `MintableERC20.sol` contract is used. This allows for easy minting of test tokens. When deploying to the `sepolia` testnet, the deployment scripts automatically switch to the official USDC contract address and use a standard ERC20 ABI, which is then provided to the frontend. This ensures that the application uses the real USDC on testnet while maintaining a flexible and easy-to-use setup for local development.
>>>>>>> bc9187a3c59ce80f9536c83efc586581c7cdd460

## Project Structure

*   **`contracts/`**: Contains the Solidity source code for the smart contracts.
    *   `PredictionMarket.sol`: The core contract for binary (YES/NO) prediction markets (AMM).
    *   `PredictionMarketFactory.sol`: A factory for creating `PredictionMarket` instances.
    *   `PredictionMarketNWay.sol`: A contract for markets with multiple outcomes (AMM).
    *   `PredictionMarketFactoryNWay.sol`: A factory for creating `PredictionMarketNWay` instances.
    *   `PredictionMarketFixedModel.sol`: A contract for binary prediction markets (Fixed-Model).
    *   `PredictionMarketFactoryFixedModel.sol`: A factory for creating `PredictionMarketFixedModel` instances.
    *   `MintableERC20.sol`: A standard ERC20 token with a minting function.
*   **`deploy/`**: Contains scripts for deploying the contracts.
*   **`test/`**: Contains the test suite for the smart contracts.
*   **`utils/`**: Contains utility scripts.
*   **`scripts/`**: Contains scripts for interacting with the contracts.
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
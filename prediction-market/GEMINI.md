# Gemini - Prediction Market Backend

This document provides an overview of the prediction market smart contracts, the development environment, and key scripts.

## Project Overview

This project contains the Solidity smart contracts for a prediction market, built using Hardhat.

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
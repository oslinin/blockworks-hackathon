# Gemini - YesNo Prediction Market

This document provides a high-level overview of the YesNo prediction market project, its components, and instructions for running the application.

## Project Overview

YesNo is a decentralized prediction market that simplifies on-chain betting through a user-friendly, Tinder-style interface. Users can easily place bets on binary outcomes by swiping left or right.

The project is divided into two main components:

*   **`prediction-market`**: The backend, containing the Solidity smart contracts and Hardhat development environment. It includes implementations for both Automated Market Maker (AMM) and Fixed-Model prediction markets.
*   **`prediction-market-nodejs`**: The frontend, a Next.js application for interacting with the smart contracts.

## Running the Application

To run the full application, you will need to have two terminal windows open.

1.  **Set up environment variables:** The local faucet requires environment variables to function.
    ```bash
    # In the root directory
    cp .env.example .env
    ```
    Then, fill in the `DEPLOYER_PRIVATE_KEY` in the new `.env` file with the private key of the deployer account from your Hardhat node.

2.  **Start the backend:**
    ```bash
    cd prediction-market
    yarn hardhat node
    ```

3.  **In a second terminal, deploy the contracts to the local network:**
    ```bash
    cd prediction-market
    yarn hardhat deploy --network localhost
    ```

4.  **Start the frontend:**
    ```bash
    cd prediction-market-nodejs
    yarn dev
    ```

## Network-Specific Details

### Localhost

When running on localhost, the application uses a mock `MintableERC20` contract as the USDC token. You can mint test USDC directly from the application's UI (on the "Test 1" page) to fund your account.

### Sepolia Testnet

When connected to the Sepolia testnet, the application uses a live USDC contract. To get test USDC for Sepolia, you can use the [Circle Faucet](https://faucet.circle.com/).

## Generating New Bets

To generate a new prediction market bet, you first need to set up the environment:
```bash
cd prediction-market-nodejs
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mv .env.local .env
```

Then, you can run the prediction agent.

You can either run the agent directly, which will run one time and exit:
```bash
cd prediction-agent-py
python3 main.py
```

Alternatively, you can run the agent as a service:
```bash
cd prediction-agent-py
adk run prediction_agent
```
Then, type `go` when prompted. This will run the agent once and print a new bet to the console. You will need to have a `GEMINI_API_KEY` environment variable set in your `.env` file.

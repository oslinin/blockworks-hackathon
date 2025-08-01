# Gemini - Prediction Market Frontend

This document provides an overview of the Next.js frontend for the prediction market.

## Project Overview

This is a Next.js application that provides a user interface for interacting with the prediction market smart contracts.

## Network-Specific Contract Handling

The application is designed to work with both `localhost` and `sepolia` networks. It dynamically loads the appropriate contract addresses and ABIs based on the network selected in the navbar dropdown.

-   **On `localhost`**: The application interacts with a `MintableERC20` contract, which allows for easy testing and development.
-   **On `sepolia`**: The application uses the official USDC contract. The backend deployment scripts provide the frontend with the correct address and a standard ERC20 ABI.

This setup ensures a seamless experience for both local development and testnet interaction.

## Project Structure

*   **`pages/`**: Contains the main pages of the application.
    *   `index.js`: The main landing page.
    *   `test*.js`: Pages for testing specific functionalities, including creating and betting on both AMM and fixed-model markets (binary and N-way).
*   **`components/`**: Contains reusable React components.
    *   `MarketDisplay.js`: The main component for displaying and interacting with a prediction market.
    *   `ConnectButton.js`: A button for connecting a web3 wallet.
*   **`abi/`**: Contains the ABI JSON files for the smart contracts.
*   **`context/`**: Contains React context providers, such as `VersionContext.js`.
*   **`prediction-agent-py/`**: Contains the Python-based prediction agent for generating new market questions.
*   **`styles/`**: Contains global CSS styles.
*   **`utils/`**: Contains utility functions.

## Commands

*   **Install dependencies:**
    ```bash
    yarn install
    ```
*   **Run the development server:**
    ```bash
    yarn dev
    ```
*   **Run the prediction agent:**
    ```bash
    cd prediction-market-nodejs/prediction-agent-py
    adk run prediction_agent
    ```
    Then, type `go` when prompted. This will run the agent once and print a new bet to the console.

# Prediction Market Frontend

This is a Next.js frontend for interacting with the Prediction Market smart contracts. It allows users to connect their wallets, view prediction markets, place bets, and see their betting history.

## Getting Started

1.  **Install dependencies:**
    ```bash
    yarn install
    yarn add next react react-dom
    ```

2.  **Run the development server:**
    ```bash
    yarn dev
    ```
    The application will be available at `http://localhost:3000`.

## Features

*   **Wallet Connection:** Connect to the application using a web3 wallet.
*   **Market Display:** View a list of available prediction markets, including the question, category, and current probabilities.
*   **Betting:** Place bets on market outcomes using USDC.
*   **Prediction Agent:** When all existing markets have been voted on, a prediction agent can be used to generate new market ideas.
*   **User Score:** The application can calculate a "user score" based on betting history to suggest relevant markets.

## Key Components

*   **`pages/`**: Contains the main pages of the application.
    *   `index.js`: The main landing page.
    *   `test*.js`: Various pages for testing specific functionality, like connecting to a wallet, interacting with the USDC contract, and placing bets.
    *   `test4-contractNway.js`: A test page for deploying an N-Way prediction market.
    *   `test5-bet.js`: A test page for placing bets on an N-Way prediction market.
*   **`components/`**: Contains reusable React components.
    *   `MarketDisplay.js`: The main component for displaying and interacting with a single prediction market.
    *   `ConnectButton.js`: A button for connecting a web3 wallet.
*   **`abi/`**: Contains the ABI (Application Binary Interface) JSON files for the smart contracts, which are necessary for the frontend to interact with them.
*   **`prediction-agent/`**: Contains the logic for the prediction agent, which can generate new market questions using a large language model.
*   **`utils/`**: Contains utility functions, such as `UserScore.js` for calculating a user's score.

## Prediction Agent

The prediction agent, located in the `prediction-agent/` directory, can be used to generate new prediction market questions. It uses a large language model (like Google's Gemini) to create questions based on real-world events.

To test the agent, run:
```bash
yarn test:agent
```

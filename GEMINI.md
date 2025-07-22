# Gemini - YesNo Prediction Market

This document provides a high-level overview of the YesNo prediction market project, its components, and instructions for running the application.

## Project Overview

YesNo is a decentralized prediction market that simplifies on-chain betting through a user-friendly, Tinder-style interface. Users can easily place bets on binary outcomes by swiping left or right.

The project is divided into two main components:

*   **`prediction-market`**: The backend, containing the Solidity smart contracts and Hardhat development environment.
*   **`prediction-market-nodejs`**: The frontend, a Next.js application for interacting with the smart contracts.

## Running the Application

To run the full application, you will need to have two terminal windows open.

1.  **Start the backend:**
    ```bash
    cd prediction-market
    yarn hardhat node
    ```

2.  **Start the frontend:**
    ```bash
    cd prediction-market-nodejs
    yarn dev
    ```

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

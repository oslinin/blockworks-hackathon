# YesNo Prediction Market

YesNo makes on-chain prediction markets radically more accessible through a Tinder-style interface. Users swipe left or right to take a fixed-size binary bet, or down to skip. Each bet mints two tokens—YES and NO—and uses a constant function market maker to enable seamless trading and price discovery.

## Key Features

- **Network Support:** The application supports both `localhost` and `sepolia` test networks. A dropdown in the navbar allows you to switch between them.
- **Dynamic Contract Loading:** Contract addresses and ABIs are now loaded dynamically based on the selected network, ensuring the frontend is always in sync with the deployed contracts.
- **On-Chain Faucet:** For local development, a faucet is available to mint test USDC. On Sepolia, you will need to use your own USDC.

## Getting Started

### Prerequisites

- Node.js and Yarn
- Python and Pip
- Hardhat
- An Infura API key for Sepolia interaction (if not using your own node)

### Environment Setup

1.  **Clone the repository.**
2.  **Install dependencies for both backend and frontend:**
    ```bash
    cd prediction-market && yarn install
    cd ../prediction-market-nodejs && yarn install
    ```
3.  **Create an environment file for the frontend:**
    In the `prediction-market-nodejs` directory, copy `.env.local.example` to `.env.local` and add your `INFURA_API_KEY`:
    ```
    INFURA_API_KEY=your_infura_api_key_here
    ```
    This is required for the Sepolia faucet to work.

### Running the Application

1.  **Start the backend (in one terminal):**
    This will start a local Hardhat node.
    ```bash
    cd prediction-market
    yarn hardhat node
    ```

2.  **Deploy contracts to localhost (in a second terminal):**
    ```bash
    cd prediction-market
    yarn hardhat deploy --network localhost
    ```

3.  **Start the frontend (in a third terminal):**
    ```bash
    cd prediction-market-nodejs
    yarn dev
    ```

The application will now be running at `http://localhost:3000`. You can use the dropdown in the navbar to switch between `localhost` and `sepolia`.

## Deployment to Sepolia

To deploy the contracts to the Sepolia testnet, run the following command:

```bash
cd prediction-market
yarn hardhat deploy --network sepolia
```

This will deploy the contracts and copy the ABI and contract addresses to the frontend's `abi/sepolia` directory.

## Prediction Agent

The prediction agent is used to generate new market questions.

**Setup:**
```bash
cd prediction-market-nodejs
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Make sure your .env file has GEMINI_API_KEY
```

**Run once:**
```bash
cd prediction-agent-py
python3 main.py
```

**Run as a service:**
```bash
cd prediction-agent-py
adk run prediction_agent
```
You will need to have a `GEMINI_API_KEY` environment variable set in your `.env` file. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
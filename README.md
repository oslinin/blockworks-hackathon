# Present

YesNo makes on-chain prediction markets radically more accessible through a Tinder-style interface. Users swipe left or right to take a fixed-size binary bet (e.g., $0.10), or down to skip. Each bet mints two tokens—YES and NO—and uses a constant function market maker to enable seamless trading and price discovery. The entry fee is deposited into a liquidity pool and ultimately awarded to the winning side based on on-chain resolution, ensuring a trustless and transparently fair outcome.

[Presentation](https://github.com/oslinin/blockworks-hackathon/blob/main/docs/safebet.pptx)

# Future

While our initial focus is on ease of and engagement, our broader vision is to build a highly liquid market where users can efficiently trade their risk preferences with one another—an opportunity that is currently limited to sophisticated traders in traditional derivatives markets. By democratizing access and simplifying the experience, we hope to unlock a new class of on-chain primitives for expressing belief and managing risk.

# Code

## Local Development

To run the project locally, you need to run the backend and frontend in separate terminals.

**Backend:**

```bash
cd prediction-market
yarn hardhat node
```

In a second terminal, deploy the contracts to the local network:

```bash
cd prediction-market
yarn hardhat deploy --network localhost
```

**Frontend:**

```bash
cd prediction-market-nodejs
yarn dev
```

## Deployment to Sepolia

To deploy the contracts to the Sepolia testnet, run the following command:

```bash
cd prediction-market
yarn hardhat deploy --network sepolia
```

This will deploy the contracts and copy the ABI and contract addresses to the frontend.

### Sepolia Deployments

You can get test USDC from the [Circle faucet](https://faucet.circle.com/).

The following contracts have been deployed to the Sepolia testnet:

*   **PredictionMarket:** [`0xD4636d7CC71bDd3e01a3AF9A65C110046a3FE06E`](https://sepolia.etherscan.io/address/0xD4636d7CC71bDd3e01a3AF9A65C110046a3FE06E)
*   **PredictionMarketFactory:** [`0x14BF6D8f65b9e4b11919C3E9D4aC53C7b6bE21f0`](https://sepolia.etherscan.io/address/0x14BF6D8f65b9e4b11919C3E9D4aC53C7b6bE21f0)
*   **PredictionMarketFactoryNWay:** [`0x909F71Fc1B1cdb6Bf90d0ffF3C11Fd1aA4Ef98d6`](https://sepolia.etherscan.io/address/0x909F71Fc1B1cdb6Bf90d0ffF3C11Fd1aA4Ef98d6)
*   **PredictionMarketNWay:** [`0xCa90fA9E2Ca9B1113f6811A6832e082c3DD2C906`](https://sepolia.etherscan.io/address/0xCa90fA9E2Ca9B1113f6811A6832e082c3DD2C906)
*   **MintableERC20:** [`0x5b7F97285d450efB8A52EcEc9306C34E7313023E`](https://sepolia.etherscan.io/address/0x5b7F97285d450efB8A52EcEc9306C34E7313023E)

## Prediction market:

- prediction-market: lauch localhost web3 backend with:
  ```bash
  yarn hardhat node
  ```
- prediction-market-nodejs: launch localhost from a different terminal with:
  ```bash
  yarn dev
  ```
- prediction-market-nodejs/prediction-agent-py: launch the prediction agent.

  First, set up the environment:
  ```bash
  cd prediction-market-nodejs
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  mv .env.local .env
  ```

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
  You will need to have a `GEMINI_API_KEY` environment variable set in your `.env` file. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
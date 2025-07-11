# Prediction Market Smart Contracts

This project contains the Solidity smart contracts for a prediction market.

It uses [Hardhat](https://hardhat.org/) for development and testing.

## Getting Started

1.  Install dependencies:
    ```bash
    yarn install
    ```

## Usage

*   Run tests:
    ```bash
    yarn hardhat test
    ```

*   Start a local Hardhat node:
    ```bash
    yarn hardhat node
    ```

## Contracts

### `MintableERC20.sol`

A standard ERC20 token with an added `mint` function, allowing the contract owner to create new tokens.

**Functions:**
- `mint(address to, uint256 amount)`: Creates `amount` new tokens and assigns them to the `to` address. Only callable by the owner.

### `PredictionMarket.sol`

The core contract for a single prediction market. It manages the automated market maker (AMM), allows users to bet, and handles the resolution and claiming of funds.

**Public Variables:**
- `usdcToken`: The ERC20 token used for betting (e.g., USDC).
- `yesToken`: The ERC20 token representing a "YES" outcome.
- `noToken`: The ERC20 token representing a "NO" outcome.
- `K`: The constant product for the AMM.
- `category`: The market's category (e.g., ELECTION, SPORTS).
- `question`: The question the market is predicting.
- `oracle`: The address responsible for resolving the market.
- `resolved`: A boolean indicating if the market has been resolved.
- `outcome`: The final outcome of the market (true for YES, false for NO).

**Functions:**
- `initialize()`: Mints the initial liquidity for the AMM.
- `getProbability()`: Returns the current probability of a "YES" outcome, based on the token balances in the AMM.
- `bet(uint256 amount, bool onYes)`: Allows a user to bet `amount` of USDC on a "YES" or "NO" outcome.
- `resolve(bool _outcome)`: Resolves the market with a final outcome. Only callable by the oracle.
- `claim()`: Allows users to claim their winnings after the market has been resolved.

### `PredictionMarketFactory.sol`

A factory contract for creating new `PredictionMarket` instances.

**Functions:**
- `createMarket(...)`: Deploys and initializes a new `PredictionMarket` contract with the specified parameters.
- `getAllMarkets()`: Returns an array of all created `PredictionMarket` contract addresses.
- `getMarketsByCategory(PredictionMarket.Category _category)`: Returns an array of all markets within a specific category.

# Backend

The solidity smart contract hardhat code should be in folder "prediction-market"

## Running the Hardhat Node and Deploying Contracts

To run a local Hardhat development node, open a terminal in the `prediction-market` directory and execute:

```bash
npx hardhat node
```

Once the node is running, open a **new** terminal in the same directory to deploy the contracts:

```bash
npx hardhat run scripts/deployFactory.js --network localhost
```

## Smart Contracts

### PredictionMarket.sol

the smart contract PredictionMarket.sol should use a CFMM to price tokens Yes and No. When the user makes a bet, a Yes and No token is minted. He keeps the one he bets on and sells the other into the liquidity pool of the PredictionMarket.

#### test.predictionmarket.js

The test script for PredictionMarket.sol
Yes token pays 1 USDC (in sepolia or ethereum mainnet, or base or avalanche testnets or mainnets) if yes happens and 0 otherwise; no token pays the complement. 500 of each are minted for 500 USDC and deposited in an LP. constant factor is 250000. Alice can place a bet on yes by sending the CFMM 100 USDC; the CFMM will mint 100 yes token and 100 no token and deposit the no token in the pool, and remove 83.333 = constant factor / 600 no token from the pool, and send it and the 100 yes token to alice. Alice now has 183.3333 yes token. She can place another bet and receive 159.52 = 250000/7000 + her prior balance. She can then deposit 1 usdc to get 2.5 yes token. Please provide the smart contracts and tests that have the above. This math should be tested in test/test.predictionmarket.js.

The contract should have function getProbability a yes and no probability, reflecting the current price. For example, For example, probabilities start at .5, because the tokens are minted in equal amounts. after the first bet in the test script, the pool had 416.66667 yes and 600 no, so the probability is .59 for yes. This probability should also be tested in test/test.predictionmarket.js.

Please make sure there is a resolve function in the contract and in the test, that resolves the prediction from the oracle. There should also be a category enum for each pool: sports, elections or crypto.

### PredictionMarketFactory.sol

There should also be a contract that keeps track of all the prediction markets that have been generated, and allows new users to bet in existing markets. It should be called PredictionMarketFactory, and it should have public functions to view liquidity pools and their category enum. It should have a public function to return all existing pools in a given category, e.g. all sports pools.

Events should be generated when an address creates a bet (mints the yes no tokens and deposits one of them in the pool.) These events should have the bet's category because they will be used to figure out address's preferences below.

It should have a view function for all outstanding bets, with category and address that bet on it, called getAllBets. it will be used below to offer outstanding bets to new addresses.

#### test/testPredictionMarketFactory.js

It should be tested in test/testPredictionMarketFactory.js.

#### deploy PredictionMarketFactory

Please include deploy script for PredictionMarketFactory for testing. In prod it will be deployed once, like uniswap factory, and individual pools and conditional tokens will be generated based on user selections.
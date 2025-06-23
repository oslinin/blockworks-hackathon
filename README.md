# Sample Hardhat Project

see excel for the math in the test folder

1. Mint 500 Yes token, 500 no token for 500 USDC. The full 500 USDC will go to the winner
2. Create a pool of 500 yes token and 500 USDC
3. Create a pool of 500 no token and 500 USDC
4. Test that yes token gets more expensive as follow (calculations in the excel in the repo)
   1. Buy 100 Yes token for 125 USDC
   2. Buy another 100 yes token for 208 USDc, the new price
   3. Buy 1 USDC of yes token (this is failing in test.contracts.js)

```shell

npm install --save-dev hardhat
yarn add @openzeppelin/contracts
yarn hardhat init

yarn hardhat compile
yarn hardhat test
yarn hardhat test --grep "step 1: buy 100 YES and check price"



```

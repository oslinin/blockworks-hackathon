require("@nomicfoundation/hardhat-toolbox");

require("hardhat-deploy");
require("./tasks/mint-usdc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

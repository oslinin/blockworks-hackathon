// Import necessary modules and configurations
require("@nomiclabs/hardhat-waffle");
const { expect, assert } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { INITIAL_SUPPLY } = require("../helper-hardhat-config");

// Define the toWei function
const toWei = (value) => ethers.utils.parseEther(value.toString());

async function oleg_debug() {
  const accounts = await getNamedAccounts();
  const user1 = accounts.user1;

  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy the Token contract
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(
    "OurToken",
    "OT",
    toWei(INITIAL_SUPPLY)
    //  , {
    // from: deployer,
    // log: true,
    // waitConfirmations: network.config.blockConfirmations || 1,
    // }
  );
  console.log(`Token deployed at ${token.address}`);

  // Get the deployed Token contract instance
  // const token = await ethers.getContract("Token", deployer);
  // console.log("Token deployed at", token.address);

  // Deploy the Exchange contract
  const ExchangeFactory = await ethers.getContractFactory("Exchange");
  const exchange = await ExchangeFactory.deploy(token.address, {
    // from: deployer,
  });
  console.log(`exchange deployed at ${exchange.address}`);

  // Approve and add liquidity
  const amount_token = toWei(200);
  console.log((amount_token / 1e18).toString());
  const amount_eth = toWei(100);
  await token.approve(exchange.address, amount_token);
  const [deployerSigner] = await ethers.getSigners(); // Get the deployer signer
  console.log(`deployer is ${deployer}`);

  console.log(`deployerSigner is ${deployerSigner.address}`);

  const tokenbalance = await token.balanceOf(deployer);

  const balance = await deployerSigner.getBalance();
  console.log("Deployer Address:", deployerSigner.address);
  console.log("Deployer balance eth:", ethers.utils.formatEther(balance));
  console.log(
    "Deployer balance token:",
    ethers.utils.formatEther(tokenbalance)
  );
  console.log("Token Address:", token.address);
  console.log("Exchange Address:", exchange.address);
  console.log("amount_eth:", ethers.utils.formatEther(amount_eth));
  console.log("amount_token:", ethers.utils.formatEther(amount_token));

  await exchange.addLiquidity(amount_token, {
    value: amount_eth,
  }); //this works!

  const contractBalance = await ethers.provider.getBalance(exchange.address);
  const reserve = await exchange.getReserve();

  console.log("getbalance");
  console.log((contractBalance / 1e18).toString());
  console.log("getreserve");
  console.log((contractBalance / 1e18).toString());
}

// Call the debug function
oleg_debug();

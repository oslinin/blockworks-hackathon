// deploy/01-deploy-prediction-market.js

const { ethers, network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
  usdcDecimals,
} = require("../helper-hardhat-config");
// const { verify } = require("../utils/verify"); // Assuming you have a verify utility

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const isDevelopment = developmentChains.includes(network.name);

  let usdcAddress;
  const initialLiquidity = networkConfig[chainId].initialLiquidityUSDC;

  // --- 1. Get the USDC Token Address ---
  if (isDevelopment) {
    const mockUSDC = await get("MockUSDC");
    usdcAddress = mockUSDC.address;
  } else {
    usdcAddress = networkConfig[chainId].usdcToken;
  }

  log("----------------------------------------------------");
  log("Deploying PredictionMarket...");

  // --- 2. Deploy the PredictionMarket Contract ---
  const args = [usdcAddress];
  const predictionMarket = await deploy("PredictionMarket", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`PredictionMarket deployed at ${predictionMarket.address}`);

  // --- 3. Provide Initial Liquidity ---
  // This step is only required if you are deploying for the first time
  // and need to fund the contract.

  // Get the newly deployed contract instance
  const marketContract = await ethers.getContractAt(
    "PredictionMarket",
    predictionMarket.address
  );

  // Get the USDC token instance
  // Note: We need a contract object to call 'approve'
  const usdcToken = await ethers.getContractAt("MockUSDC", usdcAddress);

  // Convert the initial liquidity string to the correct unit (6 decimals for USDC)
  const initialLiquidityAmount = ethers.parseUnits(
    initialLiquidity,
    usdcDecimals
  );

  if (isDevelopment) {
    // On a local network, we need to mint some mock USDC to the deployer first
    log("Minting mock USDC to deployer...");
    await usdcToken.mint(deployer, initialLiquidityAmount);
    log("Minted!");
  }

  log("Approving market contract to spend USDC...");
  const approveTx = await usdcToken.approve(
    marketContract.target, // .target is the address in ethers v6
    initialLiquidityAmount
  );
  await approveTx.wait(1);
  log("Approved!");

  log("Adding initial liquidity to the PredictionMarket...");
  const addLiquidityTx = await marketContract.addInitialLiquidity(
    initialLiquidityAmount
  );
  await addLiquidityTx.wait(1);
  log("Initial liquidity added!");

  // --- 4. Verify on Etherscan (if applicable) ---
  if (!isDevelopment && process.env.ETHERSCAN_API_KEY) {
    log("Verifying on Etherscan...");
    // await verify(predictionMarket.address, args);
  }
};

module.exports.tags = ["all", "market"];

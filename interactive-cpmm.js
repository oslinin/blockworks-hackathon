require("dotenv").config();
const { ethers } = require("ethers");
const inquirer = require("inquirer");

// Replace with your contract ABIs and bytecode
const CPMM_ABI = [
  /* ...CPMM ABI... */
];
const CPMM_BYTECODE = "0x..."; // CPMM compiled bytecode

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log(`Connected as ${wallet.address}`);

  let cpmm;

  const choices = ["Deploy CPMM contract", "Buy YES", "Show reserves", "Exit"];

  while (true) {
    const { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "What do you want to do?",
        choices,
      },
    ]);

    if (action === "Deploy CPMM contract") {
      const CPMMFactory = new ethers.ContractFactory(
        CPMM_ABI,
        CPMM_BYTECODE,
        wallet
      );

      const usdcAddress = "0x..."; // Replace with deployed mockUSDC
      const oracleAddress = "0x..."; // Replace with mock oracle
      const yesAddress = "0x..."; // Replace with YES token
      const noAddress = "0x..."; // Replace with NO token

      cpmm = await CPMMFactory.deploy(
        usdcAddress,
        oracleAddress,
        yesAddress,
        noAddress
      );
      await cpmm.waitForDeployment();
      console.log(`Deployed CPMM at ${await cpmm.getAddress()}`);
    } else if (action === "Buy YES") {
      if (!cpmm) {
        console.log("Please deploy the contract first.");
        continue;
      }

      const { amountOut } = await inquirer.prompt([
        {
          name: "amountOut",
          type: "input",
          message: "How many YES tokens to buy?",
          default: "100",
        },
      ]);

      const parsedAmount = ethers.parseEther(amountOut);
      const requiredUSDC = await cpmm.getAmountIn(
        parsedAmount,
        await cpmm.yesReserveValue(),
        await cpmm.yesReserve()
      );

      console.log(
        `Buying ${amountOut} YES tokens for ${ethers.formatEther(
          requiredUSDC
        )} USDC`
      );

      // Approve first
      const usdc = new ethers.Contract(
        await cpmm.usdc(),
        [
          "function approve(address spender, uint amount) public returns (bool)",
        ],
        wallet
      );
      await usdc.approve(await cpmm.getAddress(), requiredUSDC);

      // Buy YES
      const tx = await cpmm.buyYes(parsedAmount);
      await tx.wait();
      console.log("YES purchase successful!");
    } else if (action === "Show reserves") {
      if (!cpmm) {
        console.log("Please deploy the contract first.");
        continue;
      }

      const yesR = await cpmm.yesReserve();
      const noR = await cpmm.noReserve();
      const yesV = await cpmm.yesReserveValue();
      const noV = await cpmm.noReserveValue();

      console.log(
        `YES tokens: ${ethers.formatEther(yesR)}, USDC: ${ethers.formatEther(
          yesV
        )}`
      );
      console.log(
        `NO tokens: ${ethers.formatEther(noR)}, USDC: ${ethers.formatEther(
          noV
        )}`
      );
    } else if (action === "Exit") {
      break;
    }
  }
}

main().catch(console.error);

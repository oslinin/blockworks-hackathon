const { task } = require("hardhat/config");

task("mint-usdc", "Mints USDC to a specified address")
    .addParam("to", "The address to mint USDC to")
    .addParam("amount", "The amount of USDC to mint (in whole units)")
    .setAction(async (taskArgs, { getNamedAccounts, deployments, ethers }) => {
        const { deployer } = await getNamedAccounts();
        const usdcDeployment = await deployments.get("MintableERC20");
        const usdcContract = await ethers.getContractAt("MintableERC20", usdcDeployment.address);

        const amountInWei = ethers.utils.parseUnits(taskArgs.amount, 6); // USDC has 6 decimals

        console.log(`Minting ${taskArgs.amount} USDC to ${taskArgs.to}...`);

        const tx = await usdcContract.connect(await ethers.getSigner(deployer)).mint(taskArgs.to, amountInWei);
        await tx.wait();

        console.log("Minting successful!");
        const balance = await usdcContract.balanceOf(taskArgs.to);
        console.log(`New balance of ${taskArgs.to}: ${ethers.utils.formatUnits(balance, 6)} USDC`);
    });

module.exports = {};

import { ethers } from 'ethers';
import MintableERC20 from '../../abi/MintableERC20.json';
import contractAddresses from '../../abi/contract-addresses.json';

const usdcTokenAddress = contractAddresses.MintableERC20;
const usdcTokenAbi = MintableERC20;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }

        // Connect to the local node as the deployer
        const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
        const deployerWallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
        const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, deployerWallet);

        // Mint 100 USDC to the user's address
        const amount = ethers.parseUnits("100", 6); // 100 USDC with 6 decimals
        const tx = await usdcContract.mint(address, amount);
        await tx.wait();

        res.status(200).json({ message: 'Successfully minted 100 USDC!', txHash: tx.hash });
    } catch (error) {
        console.error("Faucet error:", error);
        res.status(500).json({ message: 'Failed to mint USDC', error: error.message });
    }
}

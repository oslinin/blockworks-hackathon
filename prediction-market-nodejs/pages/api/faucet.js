import { ethers } from 'ethers';

// --- IMPORTANT ---
// This is for local development only.
// The private key is from a default, zero-value Hardhat account.
// DO NOT use this key or this pattern in a production environment.
const DEPLOYER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const USDC_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Adjust if your address changes
const PROVIDER_URL = "http://127.0.0.1:8545"; // Local Hardhat node

const USDC_ABI = [
    "function mint(address to, uint256 amount)",
];

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

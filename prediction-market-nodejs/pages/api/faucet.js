import { ethers } from 'ethers';
import path from 'path';
import fs from 'fs';

// --- IMPORTANT ---
// This is for local development only.
// The private key is from a default, zero-value Hardhat account.
// DO NOT use this key or this pattern in a production environment.
const DEPLOYER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const getProviderUrl = (network) => {
    if (network === 'sepolia') {
        return `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
    }
    return "http://127.0.0.1:8545"; // Local Hardhat node
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { address, network } = req.body;
        if (!address || !network) {
            return res.status(400).json({ message: 'Address and network are required' });
        }

        const contractsDir = path.join(process.cwd(), `abi/${network}`);
        const addresses = JSON.parse(fs.readFileSync(path.join(contractsDir, 'contract-addresses.json'), 'utf8'));
        const USDC_CONTRACT_ADDRESS = addresses.MintableERC20;
        const usdcAbiPath = path.join(contractsDir, 'MintableERC20.json');
        const USDC_ABI = JSON.parse(fs.readFileSync(usdcAbiPath, 'utf8'));
        
        const provider = new ethers.JsonRpcProvider(getProviderUrl(network));
        const deployerWallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
        const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, deployerWallet);

        const amount = ethers.parseUnits("100", 6); // 100 USDC with 6 decimals
        const tx = await usdcContract.mint(address, amount);
        await tx.wait();

        res.status(200).json({ message: 'Successfully minted 100 USDC!', txHash: tx.hash });
    } catch (error) {
        console.error("Faucet error:", error);
        res.status(500).json({ message: 'Failed to mint USDC', error: error.message });
    }
}
import { ethers } from 'ethers';
import MintableERC20 from '../../abi/MintableERC20.json';
import contractAddresses from '../../abi/contract-addresses.json';

const usdcTokenAddress = contractAddresses.localhost.USDC;
const usdcTokenAbi = MintableERC20;

const PROVIDER_URL = process.env.NEXT_PUBLIC_LOCALHOST_RPC_URL;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const USDC_CONTRACT_ADDRESS = usdcTokenAddress;
const USDC_ABI = usdcTokenAbi;

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
        const privateKey = DEPLOYER_PRIVATE_KEY.startsWith('0x') ? DEPLOYER_PRIVATE_KEY : `0x${DEPLOYER_PRIVATE_KEY}`;
        const deployerWallet = new ethers.Wallet(privateKey, provider);
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

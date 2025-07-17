import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const USDC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local USDC
const FACTORY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Local N-Way Factory
const FACTORY_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"marketAddress","type":"address"},{"indexed":false,"internalType":"string","name":"question","type":"string"},{"indexed":false,"internalType":"enum PredictionMarketNWay.Category","name":"category","type":"uint8"}],"name":"MarketCreated","type":"event"},{"inputs":[{"internalType":"string","name":"_question","type":"string"},{"internalType":"enum PredictionMarketNWay.Category","name":"_category","type":"uint8"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_usdcToken","type":"address"},{"internalType":"string[]","name":"_outcomeNames","type":"string[]"},{"internalType":"string[]","name":"_outcomeSymbols","type":"string[]"},{"internalType":"uint256","name":"_initialLiquidity","type":"uint256"}],"name":"createMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMarkets","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum PredictionMarketNWay.Category","name":"_category","type":"uint8"}],"name":"getMarketsByCategory","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"markets","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum PredictionMarketNWay.Category","name":"","type":"uint8"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"marketsByCategory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const USDC_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
];

export default function Test4ContractNWay({ account, provider }) {
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [isMarketDeployed, setIsMarketDeployed] = useState(false);

    const deployMarket = async () => {
        if (account && provider) {
            const signer = await provider.getSigner();
            const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
            const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

            try {
                // Approve the factory to spend USDC
                const approveTx = await usdcContract.approve(FACTORY_ADDRESS, ethers.parseUnits("500", 6));
                await approveTx.wait();

                const tx = await factoryContract.createMarket(
                    "Who will win the 2024 US Election?",
                    0, // ELECTION
                    account, // Oracle
                    USDC_ADDRESS,
                    ["Biden", "Trump", "Other"],
                    ["BIDEN", "TRUMP", "OTHER"],
                    ethers.parseUnits("100", 6) // Initial liquidity
                );
                const receipt = await tx.wait();
                const marketCreatedEvent = receipt.logs.find(log => {
                    try {
                        const parsedLog = factoryContract.interface.parseLog(log);
                        return parsedLog.name === 'MarketCreated';
                    } catch (error) {
                        return false;
                    }
                });
                if (marketCreatedEvent) {
                    const parsedLog = factoryContract.interface.parseLog(marketCreatedEvent);
                    const deployedAddress = parsedLog.args.marketAddress;
                    setMarketAddress(deployedAddress);
                    setIsMarketDeployed(true);
                }
            } catch (error) {
                console.error("Error deploying market", error);
            }
        }
    };

    useEffect(() => {
        if (account && provider) {
            const getUsdcBalance = async () => {
                const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
                const balance = await usdcContract.balanceOf(account);
                setUsdcBalance(ethers.formatUnits(balance, 6));
            };

            const findMarket = async () => {
                const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
                const markets = await factoryContract.getAllMarkets();
                // This is a simplified check. A real app would need a more robust way
                // to identify a specific market.
                if (markets.length > 0) {
                    setMarketAddress(markets[0]);
                    setIsMarketDeployed(true);
                }
            };

            getUsdcBalance();
            findMarket();
        }
    }, [account, provider]);

    return (
        <div>
            <h1>Test 4: Deploy N-Way Prediction Market</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <button onClick={deployMarket} disabled={isMarketDeployed} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                        {isMarketDeployed ? "Market Deployed" : "Deploy Market"}
                    </button>
                    {marketAddress && <p>Market Address: {marketAddress}</p>}
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}
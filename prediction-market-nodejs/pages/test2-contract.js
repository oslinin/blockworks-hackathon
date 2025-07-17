import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const USDC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local USDC
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Local Factory
const FACTORY_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"marketAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"onYes","type":"bool"}],"name":"BetPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"marketAddress","type":"address"},{"indexed":false,"internalType":"string","name":"question","type":"string"},{"indexed":false,"internalType":"enum PredictionMarket.Category","name":"category","type":"uint8"}],"name":"MarketCreated","type":"event"},{"inputs":[{"internalType":"string","name":"_question","type":"string"},{"internalType":"enum PredictionMarket.Category","name":"_category","type":"uint8"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_usdcToken","type":"address"},{"internalType":"string","name":"_yesTokenName","type":"string"},{"internalType":"string","name":"_yesTokenSymbol","type":"string"},{"internalType":"string","name":"_noTokenName","type":"string"},{"internalType":"string","name":"_noTokenSymbol","type":"string"}],"name":"createMarket","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMarkets","outputs":[{"internalType":"contract PredictionMarket[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum PredictionMarket.Category","name":"_category","type":"uint8"}],"name":"getMarketsByCategory","outputs":[{"internalType":"contract PredictionMarket[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"predictionMarkets","outputs":[{"internalType":"contract PredictionMarket","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const USDC_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
];

export default function Test2Contract({ account, provider }) {
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
                    "Trump vs Biden 2020",
                    0, // ELECTION
                    account, // Oracle
                    USDC_ADDRESS,
                    "Yes Token",
                    "YES",
                    "No Token",
                    "NO"
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
            <h1>Test 2: Deploy Prediction Market</h1>
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
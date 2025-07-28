import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PredictionMarketFactoryNWay from '../abi/PredictionMarketFactoryNWay.json';
import MintableERC20 from '../abi/MintableERC20.json';
import contractAddresses from '../abi/contract-addresses.json';

const USDC_ADDRESS = contractAddresses.MintableERC20;
const FACTORY_ADDRESS = contractAddresses.PredictionMarketFactoryNWay;
const FACTORY_ABI = PredictionMarketFactoryNWay;
const USDC_ABI = MintableERC20;

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
                    "Who will win the 2025 NYC Mayoral Election?",
                    0, // ELECTION
                    account, // Oracle
                    USDC_ADDRESS,
                    ["Eric Adams", "Zohran Mamdani", "Andrew Cuomo", "Curtis Sliwa", "Jim Walden"],
                    ["ADAMS", "MAMDANI", "CUOMO", "SLIWA", "WALDEN"],
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
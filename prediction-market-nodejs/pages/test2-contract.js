import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNetwork } from '../context/NetworkContext';

export default function Test2Contract({ account, provider }) {
    const { network } = useNetwork();
    const [addresses, setAddresses] = useState(null);
    const [factoryAbi, setFactoryAbi] = useState(null);
    const [usdcAbi, setUsdcAbi] = useState(null);
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [isMarketDeployed, setIsMarketDeployed] = useState(false);

    useEffect(() => {
        const loadContractData = async () => {
            if (network) {
                const addrs = await import(`../abi/${network}/contract-addresses.json`);
                const factory = await import(`../abi/${network}/PredictionMarketFactory.json`);
                const usdc = await import(`../abi/${network}/MintableERC20.json`);
                setAddresses(addrs.default);
                setFactoryAbi(factory.default);
                setUsdcAbi(usdc.default);
            }
        };
        loadContractData();
    }, [network]);

    const deployMarket = async () => {
        if (account && provider && addresses && factoryAbi && usdcAbi) {
            const signer = await provider.getSigner();
            const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, factoryAbi, signer);
            const usdcContract = new ethers.Contract(addresses.MintableERC20, usdcAbi, signer);

            const approveAmount = network === 'sepolia' ? ethers.parseUnits("1", 6) : ethers.parseUnits("500", 6);
            try {
                // Approve the factory to spend USDC
                const approveTx = await usdcContract.approve(addresses.PredictionMarketFactory, approveAmount);
                await approveTx.wait();

                const tx = await factoryContract.createMarket(
                    "Trump vs Biden 2020",
                    0, // ELECTION
                    account, // Oracle
                    addresses.MintableERC20,
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
        if (account && provider && addresses && usdcAbi) {
            const getUsdcBalance = async () => {
                const usdcContract = new ethers.Contract(addresses.MintableERC20, usdcAbi, provider);
                const balance = await usdcContract.balanceOf(account);
                setUsdcBalance(ethers.formatUnits(balance, 6));
            };

            const findMarket = async () => {
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, factoryAbi, provider);
                const markets = await factoryContract.getAllMarkets();
                if (markets.length > 0) {
                    setMarketAddress(markets[0]);
                    setIsMarketDeployed(true);
                }
            };

            getUsdcBalance();
            findMarket();
        }
    }, [account, provider, addresses, factoryAbi, usdcAbi]);

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
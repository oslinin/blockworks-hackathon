import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PredictionMarketFactoryNWayFixedModel from '../abi/PredictionMarketFactoryNWayFixedModel.json';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from '../abi/contract-addresses.json';
import { useWeb3 } from '../context/Web3Context';

const FACTORY_ABI = PredictionMarketFactoryNWayFixedModel;

export default function Test10ContractNWayFixedModel() {
    const { account, provider } = useWeb3();
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [isMarketDeployed, setIsMarketDeployed] = useState(false);

    const getAddresses = async () => {
        if (provider) {
            const network = await provider.getNetwork();
            return network.chainId.toString() === '31337' ? contractAddresses.localhost : contractAddresses.sepolia;
        }
        return contractAddresses.localhost;
    };

    const getUsdcAbi = async () => {
        if (provider) {
            const network = await provider.getNetwork();
            return network.chainId.toString() === '31337' ? MintableERC20 : OfficialUSDC;
        }
        return MintableERC20;
    };

    const deployMarket = async () => {
        if (account && provider) {
            const addresses = await getAddresses();
            const signer = await provider.getSigner();
            const factoryContract = new ethers.Contract(addresses.PredictionMarketFactoryNWayFixedModel, FACTORY_ABI, signer);
            const outcomes = ["Eric Adams", "Zohran Mamdani", "Curtis Sliwa", "Andrew Cuomo", "Brad Lander"];

            try {
                const tx = await factoryContract.createMarket(
                    "Who will win the next NYC Mayor election?",
                    0, // ELECTION
                    account, // Oracle
                    addresses.USDC,
                    outcomes.length
                );
                const receipt = await tx.wait();
                const marketCreatedEvent = receipt.logs.find(log => {
                    try {
                        const parsedLog = factoryContract.interface.parseLog(log);
                        return parsedLog.name === 'NWayFixedModelMarketCreated';
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
        const fetchData = async () => {
            if (account && provider) {
                const addresses = await getAddresses();
                const USDC_ABI = await getUsdcAbi();
                const getUsdcBalance = async () => {
                    const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, provider);
                    const balance = await usdcContract.balanceOf(account);
                    setUsdcBalance(ethers.formatUnits(balance, 6));
                };

                const findMarket = async () => {
                    const factoryContract = new ethers.Contract(addresses.PredictionMarketFactoryNWayFixedModel, FACTORY_ABI, provider);
                    const markets = await factoryContract.getAllNWayFixedModelMarkets();
                    if (markets.length > 0) {
                        setMarketAddress(markets[0]);
                        setIsMarketDeployed(true);
                    }
                };

                getUsdcBalance();
                findMarket();
            }
        };
        fetchData();
    }, [account, provider]);


    return (
        <div>
            <h1>Test 10: Deploy N-Way Fixed-Model Prediction Market</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <button onClick={deployMarket} disabled={isMarketDeployed} className="border border-gray-400 rounded p-2 mt-2">
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

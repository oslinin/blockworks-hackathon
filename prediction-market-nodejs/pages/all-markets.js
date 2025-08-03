import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PredictionMarketFactory from '../abi/PredictionMarketFactory.json';
import PredictionMarket from '../abi/PredictionMarket.json';
import { useWeb3 } from '../context/Web3Context';
import contractAddresses from '../abi/contract-addresses.json';

export default function AllMarkets() {
    const { provider } = useWeb3();
    const [markets, setMarkets] = useState([]);

    useEffect(() => {
        const fetchMarkets = async () => {
            if (provider) {
                const network = await provider.getNetwork();
                const addresses = network.chainId.toString() === '31337' ? contractAddresses.localhost : contractAddresses.sepolia;
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, PredictionMarketFactory, provider);
                const marketAddresses = await factoryContract.getAllMarkets();
                const marketsData = await Promise.all(marketAddresses.map(async (address) => {
                    const marketContract = new ethers.Contract(address, PredictionMarket.abi, provider);
                    const question = await marketContract.question();
                    const totalDeposited = await marketContract.totalDeposited();
                    return {
                        address,
                        question,
                        expiration: "N/A", // No expiration date in the contract yet
                        totalDeposited: ethers.formatUnits(totalDeposited, 6),
                    };
                }));
                const sortedMarkets = marketsData.sort((a, b) => b.totalDeposited - a.totalDeposited);
                setMarkets(sortedMarkets);
            }
        };
        fetchMarkets();
    }, [provider]);

    return (
        <div>
            <h1>All Markets</h1>
            <div>
                {markets.map(market => (
                    <div key={market.address} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                        <p><strong>Question:</strong> {market.question}</p>
                        <p><strong>Expiration:</strong> {market.expiration}</p>
                        <p><strong>Total Deposited:</strong> {market.totalDeposited} USDC</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

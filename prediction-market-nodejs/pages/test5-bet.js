import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getAddresses } from '../lib/addresses';
import PredictionMarketNWay from '../abi/PredictionMarketNWay.json';
import PredictionMarketFactoryNWay from '../abi/PredictionMarketFactoryNWay.json';

const MARKET_ABI = PredictionMarketNWay;
const FACTORY_ABI = PredictionMarketFactoryNWay;
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function mint(address to, uint256 amount)",
    "function symbol() view returns (string)",
];

export default function Test5Bet({ account, provider }) {
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [outcomeTokens, setOutcomeTokens] = useState([]);
    const [probabilities, setProbabilities] = useState([]);
    const [addresses, setAddresses] = useState(getAddresses("localhost"));

    useEffect(() => {
        const setNetworkAddresses = async () => {
            if (provider) {
                const network = await provider.getNetwork();
                setAddresses(getAddresses(network.name));
            }
        };
        setNetworkAddresses();
    }, [provider]);

    const placeBet = async (outcomeIndex) => {
        if (account && provider && marketAddress) {
            const betAmount = "1"; // 1 USDC
            const betAmountInWei = ethers.parseUnits(betAmount, 6);
            const signer = await provider.getSigner();
            const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, signer);
            const usdcContract = new ethers.Contract(addresses.USDC_ADDRESS, ERC20_ABI, signer);

            try {
                // Approve the market to spend USDC
                const approveUsdcTx = await usdcContract.approve(marketAddress, betAmountInWei);
                await approveUsdcTx.wait();

                const betTx = await marketContract.bet(betAmountInWei, outcomeIndex);
                await betTx.wait();

                updateBalances();
            } catch (error) {
                console.error("Error placing bet", error);
            }
        }
    };

    const updateBalances = async () => {
        if (account && provider) {
            const usdcContract = new ethers.Contract(addresses.USDC_ADDRESS, ERC20_ABI, provider);
            const usdcBal = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(usdcBal, 6));

            if (marketAddress) {
                const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, provider);
                const probs = await marketContract.getProbabilities();
                setProbabilities(probs.map(p => ethers.formatUnits(p, 18)));

                const tokenAddresses = [];
                const tokenBalances = [];
                for (let i = 0; i < probs.length; i++) {
                    const tokenAddr = await marketContract.outcomeTokens(i);
                    const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, provider);
                    const tokenBal = await tokenContract.balanceOf(account);
                    const symbol = await tokenContract.symbol();
                    tokenAddresses.push({ address: tokenAddr, balance: ethers.formatUnits(tokenBal, 18), symbol: symbol });
                }
                setOutcomeTokens(tokenAddresses);
            }
        }
    };

    useEffect(() => {
        if (account && provider) {
            const findMarket = async () => {
                const factoryContract = new ethers.Contract(addresses.FACTORY_NWAY_ADDRESS, FACTORY_ABI, provider);
                const markets = await factoryContract.getAllMarkets();
                if (markets.length > 0) {
                    setMarketAddress(markets[markets.length - 1]); // Use the latest market
                }
            };
            findMarket();
        }
    }, [account, provider, addresses]);

    useEffect(() => {
        if (marketAddress) {
            updateBalances();
        }
    }, [marketAddress]);

    return (
        <div>
            <h1>Test 5: Place a Bet (N-Way)</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <p>Market Address: {marketAddress}</p>
                    <br />
                    {outcomeTokens.map((token, index) => (
                        <div key={token.address}>
                            <p>{token.symbol} Token Address: {token.address}</p>
                            <p>{token.symbol} Token Balance: {token.balance}</p>
                            <p>Probability: {probabilities[index]}</p>
                            <button onClick={() => placeBet(index)} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}>Bet on {token.symbol}</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}
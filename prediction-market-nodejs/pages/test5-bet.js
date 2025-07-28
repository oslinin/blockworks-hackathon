import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarketABI from '../abi/PredictionMarketNWay.json';
import FactoryABI from '../abi/PredictionMarketFactoryNWay.json';

const USDC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local USDC
const FACTORY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Local N-Way Factory
const MARKET_ABI = MarketABI;
const FACTORY_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"marketAddress","type":"address"},{"indexed":false,"internalType":"string","name":"question","type":"string"},{"indexed":false,"internalType":"enum PredictionMarketNWay.Category","name":"category","type":"uint8"}],"name":"MarketCreated","type":"event"},{"inputs":[{"internalType":"string","name":"_question","type":"string"},{"internalType":"enum PredictionMarketNWay.Category","name":"_category","type":"uint8"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_usdcToken","type":"address"},{"internalType":"string[]","name":"_outcomeNames","type":"string[]"},{"internalType":"string[]","name":"_outcomeSymbols","type":"string[]"},{"internalType":"uint256","name":"_initialLiquidity","type":"uint256"}],"name":"createMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMarkets","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum PredictionMarketNWay.Category","name":"_category","type":"uint8"}],"name":"getMarketsByCategory","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"markets","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum PredictionMarketNWay.Category","name":"","type":"uint8"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"marketsByCategory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
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

    const placeBet = async (outcomeIndex) => {
        if (account && provider && marketAddress) {
            const betAmount = "1"; // 1 USDC
            const betAmountInWei = ethers.parseUnits(betAmount, 6);
            const signer = await provider.getSigner();
            const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, signer);
            const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);

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
            const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
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
                const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
                const markets = await factoryContract.getAllMarkets();
                if (markets.length > 0) {
                    setMarketAddress(markets[markets.length - 1]); // Use the latest market
                }
            };
            findMarket();
        }
    }, [account, provider]);

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
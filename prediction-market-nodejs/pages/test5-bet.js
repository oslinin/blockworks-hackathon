import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarketABI from '../abi/PredictionMarketNWay.json';
import FactoryABI from '../abi/PredictionMarketFactoryNWay.json';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from '../abi/contract-addresses.json';
import { useWeb3 } from '../context/Web3Context';
import Button from '../components/Button';

const MARKET_ABI = MarketABI;
const FACTORY_ABI = FactoryABI;

export default function Test5Bet() {
    const { account, provider } = useWeb3();
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [outcomeTokens, setOutcomeTokens] = useState([]);
    const [probabilities, setProbabilities] = useState([]);

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

    const placeBet = async (outcomeIndex) => {
        if (account && provider && marketAddress) {
            const addresses = await getAddresses();
            const USDC_ABI = await getUsdcAbi();
            const betAmount = "1"; // 1 USDC
            const betAmountInWei = ethers.parseUnits(betAmount, 6);
            const signer = await provider.getSigner();
            const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, signer);
            const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, signer);

            try {
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
            const addresses = await getAddresses();
            const USDC_ABI = await getUsdcAbi();
            const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, provider);
            const usdcBal = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(usdcBal, 6));

            if (marketAddress) {
                const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, provider);
                const tokens = [];
                let i = 0;
                while (true) {
                    try {
                        const tokenAddress = await marketContract.outcomeTokens(i);
                        const tokenContract = new ethers.Contract(tokenAddress, MintableERC20, provider);
                        const balance = await tokenContract.balanceOf(account);
                        const symbol = await tokenContract.symbol();
                        tokens.push({
                            address: tokenAddress,
                            symbol: symbol,
                            balance: ethers.formatUnits(balance, 18)
                        });
                        i++;
                    } catch (error) {
                        break;
                    }
                }
                setOutcomeTokens(tokens);

                const probs = await marketContract.getProbabilities();
                setProbabilities(probs.map(p => Number(ethers.formatUnits(p, 16)).toFixed(2)));
            }
        }
    };

    const [allMarkets, setAllMarkets] = useState([]);
    const [currentMarketIndex, setCurrentMarketIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (account && provider) {
                const addresses = await getAddresses();
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactoryNWay, FACTORY_ABI, provider);
                const markets = await factoryContract.getAllMarkets();
                setAllMarkets(markets);
                if (markets.length > 0) {
                    setMarketAddress(markets[0]);
                }
            }
        };
        fetchData();
    }, [account, provider]);

    useEffect(() => {
        if (marketAddress) {
            updateBalances();
        }
    }, [marketAddress, account, provider]);

    const goToNextMarket = () => {
        if (currentMarketIndex < allMarkets.length - 1) {
            const nextIndex = currentMarketIndex + 1;
            setCurrentMarketIndex(nextIndex);
            setMarketAddress(allMarkets[nextIndex]);
        }
    };

    const goToPreviousMarket = () => {
        if (currentMarketIndex > 0) {
            const prevIndex = currentMarketIndex - 1;
            setCurrentMarketIndex(prevIndex);
            setMarketAddress(allMarkets[prevIndex]);
        }
    };

    return (
        <div>
            <h1>Test 5: Place a Bet (N-Way)</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <p>Market Address: {marketAddress}</p>
                    <br />
                    <div>
                        {outcomeTokens.map((token, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <p>{token.symbol} Balance: {token.balance}</p>
                                <p>Probability: {probabilities[index] || 0}%</p>
                                <Button onClick={() => placeBet(index)} className="mr-2">Bet on {token.symbol}</Button>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <Button onClick={goToPreviousMarket} disabled={currentMarketIndex === 0} className="mr-2">Previous Market</Button>
                        <Button onClick={goToNextMarket} disabled={currentMarketIndex === allMarkets.length - 1}>Next Market</Button>
                    </div>
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}
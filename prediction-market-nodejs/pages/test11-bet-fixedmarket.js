import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarketABI from '../abi/PredictionMarketNWayFixedModel.json';
import FactoryABI from '../abi/PredictionMarketFactoryNWayFixedModel.json';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from '../abi/contract-addresses.json';
import { useWeb3 } from '../context/Web3Context';
import Button from '../components/Button';

const MARKET_ABI = MarketABI;
const FACTORY_ABI = FactoryABI;
const OUTCOME_NAMES = ["Eric Adams", "Zohran Mamdani", "Curtis Sliwa", "Andrew Cuomo", "Brad Lander"];

export default function Test11BetFixedMarket() {
    const { account, provider } = useWeb3();
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [bets, setBets] = useState([]);
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
                const betTx = await marketContract.bet(outcomeIndex);
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
                const userBets = [];
                const totalBetsPerOutcome = [];
                let totalBets = 0n;

                for (let i = 0; i < OUTCOME_NAMES.length; i++) {
                    const betCount = await marketContract.betsPerOutcome(i, account);
                    userBets.push(betCount.toString());
                    const totalOutcomeBets = await marketContract.totalBetsPerOutcome(i);
                    totalBetsPerOutcome.push(totalOutcomeBets);
                    totalBets += totalOutcomeBets;
                }
                setBets(userBets);

                if (totalBets > 0n) {
                    const probs = totalBetsPerOutcome.map(
                        (count) => Number((count * 10000n) / totalBets) / 100
                    );
                    setProbabilities(probs);
                } else {
                    setProbabilities(new Array(OUTCOME_NAMES.length).fill(0));
                }
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (account && provider) {
                const addresses = await getAddresses();
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactoryNWayFixedModel, FACTORY_ABI, provider);
                const markets = await factoryContract.getAllNWayFixedModelMarkets();
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
    }, [marketAddress]);

    return (
        <div>
            <h1>Test 11: Place a Bet (N-Way Fixed-Model)</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <p>Market Address: {marketAddress}</p>
                    <br />
                    {OUTCOME_NAMES.map((name, index) => (
                        <div key={index}>
                            <p>Your Bets on {name}: {bets[index] || 0}</p>
                            <p>Probability: {probabilities[index] || 0}%</p>
                            <Button onClick={() => placeBet(index)} className="mr-2">Bet on {name} (1 USDC)</Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarketABI from '../abi/PredictionMarket.json';
import FactoryABI from '../abi/PredictionMarketFactory.json';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from '../abi/contract-addresses.json';
import { useWeb3 } from '../context/Web3Context';
import Button from '../components/Button';

const MARKET_ABI = MarketABI;
const FACTORY_ABI = FactoryABI;

export default function Test3Bet() {
    const { account, provider } = useWeb3();
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [yesTokenBalance, setYesTokenBalance] = useState(null);
    const [noTokenBalance, setNoTokenBalance] = useState(null);
    const [yesToken, setYesToken] = useState(null);
    const [noToken, setNoToken] = useState(null);
    const [yesProbability, setYesProbability] = useState(0);

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

    const placeBet = async (onYes) => {
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

                const betTx = await marketContract.bet(betAmountInWei, onYes);
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
                const yesTokenAddress = await marketContract.yesToken();
                const noTokenAddress = await marketContract.noToken();
                setYesToken(yesTokenAddress);
                setNoToken(noTokenAddress);

                const yesTokenContract = new ethers.Contract(yesTokenAddress, MintableERC20, provider);
                const noTokenContract = new ethers.Contract(noTokenAddress, MintableERC20, provider);

                const yesBal = await yesTokenContract.balanceOf(account);
                const noBal = await noTokenContract.balanceOf(account);

                setYesTokenBalance(ethers.formatUnits(yesBal, 18));
                setNoTokenBalance(ethers.formatUnits(noBal, 18));

                const yesProb = await marketContract.getProbability();
                setYesProbability(Number(ethers.formatUnits(yesProb, 16)).toFixed(2));
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (account && provider) {
                const addresses = await getAddresses();
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, FACTORY_ABI, provider);
                const markets = await factoryContract.getAllMarkets();
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

    return (
        <div>
            <h1>Test 3: Place a Bet</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <p>Market Address: {marketAddress}</p>
                    <p>Yes Token Address: {yesToken}</p>
                    <p>No Token Address: {noToken}</p>
                    <p>Your Yes Token Balance: {yesTokenBalance}</p>
                    <p>Your No Token Balance: {noTokenBalance}</p>
                    <br />
                    <div>
                        <p>Yes Probability: {yesProbability}%</p>
                        <p>No Probability: {(100 - yesProbability).toFixed(2)}%</p>
                    </div>
                    <Button onClick={() => placeBet(true)} className="mr-2">Bet Yes (1 USDC)</Button>
                    <Button onClick={() => placeBet(false)}>Bet No (1 USDC)</Button>
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}

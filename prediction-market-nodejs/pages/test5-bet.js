import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNetwork } from '../context/NetworkContext';

export default function Test5Bet({ account, provider }) {
    const { network } = useNetwork();
    const [addresses, setAddresses] = useState(null);
    const [marketAbi, setMarketAbi] = useState(null);
    const [factoryAbi, setFactoryAbi] = useState(null);
    const [erc20Abi, setErc20Abi] = useState(null);
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [outcomeTokens, setOutcomeTokens] = useState([]);
    const [probabilities, setProbabilities] = useState([]);

    useEffect(() => {
        const loadContractData = async () => {
            if (network) {
                const addrs = await import(`../abi/${network}/contract-addresses.json`);
                const market = await import(`../abi/${network}/PredictionMarketNWay.json`);
                const factory = await import(`../abi/${network}/PredictionMarketFactoryNWay.json`);
                const erc20 = await import(`../abi/${network}/MintableERC20.json`);
                setAddresses(addrs.default);
                setMarketAbi(market.default);
                setFactoryAbi(factory.default);
                setErc20Abi(erc20.default);
            }
        };
        loadContractData();
    }, [network]);

    const placeBet = async (outcomeIndex) => {
        if (account && provider && marketAddress && addresses && erc20Abi) {
            const betAmount = "1"; // 1 USDC
            const betAmountInWei = ethers.parseUnits(betAmount, 6);
            const signer = await provider.getSigner();
            const marketContract = new ethers.Contract(marketAddress, marketAbi, signer);
            const usdcContract = new ethers.Contract(addresses.MintableERC20, erc20Abi, signer);

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
        if (account && provider && addresses && erc20Abi && marketAddress) {
            const usdcContract = new ethers.Contract(addresses.MintableERC20, erc20Abi, provider);
            const usdcBal = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(usdcBal, 6));

            if (marketAddress) {
                const marketContract = new ethers.Contract(marketAddress, marketAbi, provider);
                const probs = await marketContract.getProbabilities();
                setProbabilities(probs.map(p => ethers.formatUnits(p, 18)));

                const tokenAddresses = [];
                for (let i = 0; i < probs.length; i++) {
                    const tokenAddr = await marketContract.outcomeTokens(i);
                    const tokenContract = new ethers.Contract(tokenAddr, erc20Abi, provider);
                    const tokenBal = await tokenContract.balanceOf(account);
                    const symbol = await tokenContract.symbol();
                    tokenAddresses.push({ address: tokenAddr, balance: ethers.formatUnits(tokenBal, 18), symbol: symbol });
                }
                setOutcomeTokens(tokenAddresses);
            }
        }
    };

    useEffect(() => {
        if (account && provider && addresses && factoryAbi) {
            const findMarket = async () => {
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactoryNWay, factoryAbi, provider);
                const markets = await factoryContract.getAllMarkets();
                if (markets.length > 0) {
                    setMarketAddress(markets[markets.length - 1]); // Use the latest market
                }
            };
            findMarket();
        }
    }, [account, provider, addresses, factoryAbi]);

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
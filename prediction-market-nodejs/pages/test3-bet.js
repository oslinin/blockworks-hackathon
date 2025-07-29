import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNetwork } from '../context/NetworkContext';

export default function Test3Bet({ account, provider }) {
    const { network } = useNetwork();
    const [addresses, setAddresses] = useState(null);
    const [marketAbi, setMarketAbi] = useState(null);
    const [factoryAbi, setFactoryAbi] = useState(null);
    const [erc20Abi, setErc20Abi] = useState(null);
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [yesTokenAddress, setYesTokenAddress] = useState(null);
    const [noTokenAddress, setNoTokenAddress] = useState(null);
    const [yesTokenBalance, setYesTokenBalance] = useState(null);
    const [noTokenBalance, setNoTokenBalance] = useState(null);
    const [isLocalhost, setIsLocalhost] = useState(false);
    const [yesProbability, setYesProbability] = useState(null);
    const [noProbability, setNoProbability] = useState(null);

    useEffect(() => {
        const loadContractData = async () => {
            if (network) {
                const addrs = await import(`../abi/${network}/contract-addresses.json`);
                const market = await import(`../abi/${network}/PredictionMarket.json`);
                const factory = await import(`../abi/${network}/PredictionMarketFactory.json`);
                const erc20 = await import(`../abi/${network}/MintableERC20.json`);
                setAddresses(addrs.default);
                setMarketAbi(market.default);
                setFactoryAbi(factory.default);
                setErc20Abi(erc20.default);
            }
        };
        loadContractData();
    }, [network]);

    const placeBet = async (onYes) => {
        if (account && provider && marketAddress && addresses && erc20Abi) {
            const betAmount = "1"; // 1 USDC
            const betAmountInWei = ethers.parseUnits(betAmount, 6);
            const signer = await provider.getSigner();
            const marketContract = new ethers.Contract(marketAddress, marketAbi, signer);
            const usdcContract = new ethers.Contract(addresses.MintableERC20, erc20Abi, signer);

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
        if (account && provider && addresses && erc20Abi && marketAddress) {
            const usdcContract = new ethers.Contract(addresses.MintableERC20, erc20Abi, provider);
            const usdcBal = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(usdcBal, 6));

            if (marketAddress) {
                const marketContract = new ethers.Contract(marketAddress, marketAbi, provider);
                const yesTokenAddr = await marketContract.yesToken();
                const noTokenAddr = await marketContract.noToken();
                setYesTokenAddress(yesTokenAddr);
                setNoTokenAddress(noTokenAddr);

                const yesTokenContract = new ethers.Contract(yesTokenAddr, erc20Abi, provider);
                const yesBal = await yesTokenContract.balanceOf(account);
                setYesTokenBalance(ethers.formatUnits(yesBal, 18));

                const noTokenContract = new ethers.Contract(noTokenAddr, erc20Abi, provider);
                const noBal = await noTokenContract.balanceOf(account);
                setNoTokenBalance(ethers.formatUnits(noBal, 18));

                const yesProbabilityBN = await marketContract.getProbability();
                const oneHundred = ethers.parseUnits("100", 18);
                const noProbabilityBN = oneHundred - yesProbabilityBN;

                setYesProbability(ethers.formatUnits(yesProbabilityBN, 18));
                setNoProbability(ethers.formatUnits(noProbabilityBN, 18));
            }
        }
    };

    useEffect(() => {
        if (provider) {
            const checkNetwork = async () => {
                const net = await provider.getNetwork();
                setIsLocalhost(net.chainId === 31337);
            };
            checkNetwork();
        }
        if (account && provider && addresses && factoryAbi) {
            const findMarket = async () => {
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, factoryAbi, provider);
                const markets = await factoryContract.getAllMarkets();
                if (markets.length > 0) {
                    setMarketAddress(markets[0]);
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
            <h1>Test 3: Place a Bet</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <p>Market Address: {marketAddress}</p>
                    <p>Yes Token Address: {yesTokenAddress}</p>
                    <p>No Token Address: {noTokenAddress}</p>
                    <p>Yes Token Balance: {yesTokenBalance}</p>
                    <p>No Token Balance: {noTokenBalance}</p>
                    <br />
                    <p>Yes Probability: {yesProbability}</p>
                    <p>No Probability: {noProbability}</p>
                    <br />
                    <button onClick={() => placeBet(true)} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}>Bet Yes (Biden)</button>
                    <button onClick={() => placeBet(false)} style={{ backgroundColor: '#eee', padding: '1px solid #ccc', borderRadius: '5px' }}>Bet No (Trump)</button>
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}

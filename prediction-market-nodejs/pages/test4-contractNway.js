import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PredictionMarketFactoryNWay from '../abi/PredictionMarketFactoryNWay.json';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from '../abi/contract-addresses.json';
import { useWeb3 } from '../context/Web3Context';

const FACTORY_ABI = PredictionMarketFactoryNWay;

export default function Test4ContractNWay() {
    const { account, provider } = useWeb3();
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [marketAddress, setMarketAddress] = useState(null);
    const [isMarketDeployed, setIsMarketDeployed] = useState(false);
    const [liquidity, setLiquidity] = useState('500');

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

    const [betQuestion, setBetQuestion] = useState('');
    const [outcomes, setOutcomes] = useState([]);
    const [category, setCategory] = useState('Sports');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateBet = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/run-agent-sequence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API request failed');
            }

            const agentData = await response.json();
            if (agentData.enhancement && agentData.enhancement.length > 0) {
                const bet = agentData.enhancement[0];
                setBetQuestion(bet.bet);
                setOutcomes(bet.outcomes.map(o => o.name));
            } else {
                alert('The agent did not return any enhancement data.');
            }
        } catch (error) {
            console.error('Error generating bet:', error);
            alert('Failed to generate bet. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const deployMarket = async () => {
        if (account && provider && betQuestion && outcomes.length > 0) {
            const addresses = await getAddresses();
            const USDC_ABI = await getUsdcAbi();
            const signer = await provider.getSigner();
            const factoryContract = new ethers.Contract(addresses.PredictionMarketFactoryNWay, FACTORY_ABI, signer);
            const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, signer);

            const categoryIndex = {
                "Sports": 1,
                "Crypto": 2,
                "Politics": 0,
                "Entertainment": 3,
                "Misc": 4
            };

            const outcomeSymbols = outcomes.map(o => o.substring(0, 5).toUpperCase());

            try {
                const liquidityAmount = ethers.parseUnits(liquidity, 6);
                const approveTx = await usdcContract.approve(addresses.PredictionMarketFactoryNWay, liquidityAmount);
                await approveTx.wait();

                const tx = await factoryContract.createMarket(
                    betQuestion,
                    categoryIndex[category],
                    account, // Oracle
                    addresses.USDC,
                    outcomes,
                    outcomeSymbols,
                    liquidityAmount
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
                    setBetQuestion('');
                    setOutcomes([]);
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
                    const factoryContract = new ethers.Contract(addresses.PredictionMarketFactoryNWay, FACTORY_ABI, provider);
                    const markets = await factoryContract.getAllMarkets();
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
            <h1>Test 4: Deploy N-Way YesNo Market</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    <div style={{ marginTop: '10px' }}>
                        <label>
                            Initial Liquidity (Tokens):
                            <input type="text" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} style={{ marginLeft: '10px', width: '100px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }} />
                        </label>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label>
                            Category:
                            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                                <option value="Sports">Sports</option>
                                <option value="Crypto">Crypto</option>
                                <option value="Politics">Politics</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Misc">Misc</option>
                            </select>
                        </label>
                        <button onClick={generateBet} disabled={isGenerating} className="border border-gray-400 rounded p-2 mt-2" style={{ marginLeft: '10px' }}>
                            {isGenerating ? "Generating..." : "Generate Bet"}
                        </button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <input type="text" value={betQuestion} readOnly style={{ width: '500px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }} />
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        {outcomes.map((outcome, index) => (
                            <input key={index} type="text" value={outcome} readOnly style={{ width: '200px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px', marginRight: '10px' }} />
                        ))}
                    </div>
                    <button onClick={deployMarket} className="border border-gray-400 rounded p-2 mt-2">
                        Deploy Market
                    </button>
                    {marketAddress && <p>New Market Address: {marketAddress}</p>}
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}
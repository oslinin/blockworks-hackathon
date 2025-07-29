import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNetwork } from '../context/NetworkContext';

export default function Test1USDC({ account, provider }) {
    const { network } = useNetwork();
    const [usdcAddress, setUsdcAddress] = useState(null);
    const [usdcAbi, setUsdcAbi] = useState(null);
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [isLocalhost, setIsLocalhost] = useState(false);
    const [nonce, setNonce] = useState(0);
    const [minting, setMinting] = useState(false);

    useEffect(() => {
        const loadContractData = async () => {
            if (network) {
                const addresses = await import(`../abi/${network}/contract-addresses.json`);
                const abi = await import(`../abi/${network}/MintableERC20.json`);
                setUsdcAddress(addresses.MintableERC20);
                setUsdcAbi(abi.default);
            }
        };
        loadContractData();
    }, [network]);

    const updateBalance = async () => {
        if (account && provider && usdcAddress && usdcAbi) {
            const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);
            const balance = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(balance, 6));
        }
    };

    const handleMint = async () => {
        if (account && provider) {
            setMinting(true);
            try {
                const response = await fetch('/api/faucet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ address: account, network: network }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong with the faucet.");
                }

                await provider.waitForTransaction(data.txHash);
                await updateBalance();
                setNonce(n => n + 1);

            } catch (error) {
                console.error("Error using faucet:", error);
            } finally {
                setMinting(false);
            }
        }
    };

    useEffect(() => {
        if (provider) {
            const checkNetwork = async () => {
                const net = await provider.getNetwork();
                setIsLocalhost(net.chainId === 31337n);
            };
            checkNetwork();
        }
        if (account && provider) {
            updateBalance();
        }
    }, [account, provider, nonce, usdcAddress, usdcAbi]);

    return (
        <div>
            <h1>Test 1: Connect and Show USDC Balance</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Contract Address: {usdcAddress}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    {isLocalhost && (
                        <div>
                            <button onClick={handleMint} disabled={minting} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                {minting ? 'Minting...' : 'Mint 100 USDC'}
                            </button>
                            <p style={{ fontSize: '0.8em', color: '#666' }}>(Only available on localhost)</p>
                        </div>
                    )}
                    {network === 'sepolia' && (
                        <div>
                            <h3>Sepolia Faucets</h3>
                            <ul>
                                <li><a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer">Circle USDC Faucet</a></li>
                                <li><a href="https://faucetlink.to/sepolia" target="_blank" rel="noopener noreferrer">Sepolia ETH Faucet 1</a></li>
                                <li><a href="https://docs.metamask.io/developer-tools/faucet/" target="_blank" rel="noopener noreferrer">Sepolia ETH Faucet 2</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}

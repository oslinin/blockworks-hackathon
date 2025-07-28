import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MintableERC20 from '../abi/MintableERC20.json';
import contractAddresses from '../abi/contract-addresses.json';

const USDC_ADDRESS = contractAddresses.MintableERC20;
const USDC_ABI = MintableERC20;

export default function Test1USDC({ account, provider }) {
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [isLocalhost, setIsLocalhost] = useState(false);

    const [minting, setMinting] = useState(false);

    const updateBalance = async () => {
        if (account && provider) {
            const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
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
                    body: JSON.stringify({ address: account }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong with the faucet.");
                }

                // Wait for the transaction to be mined
                await provider.waitForTransaction(data.txHash);

                // Update balance
                await updateBalance();

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
                const network = await provider.getNetwork();
                setIsLocalhost(network.chainId === 31337n);
            };
            checkNetwork();
        }
        if (account && provider) {
            updateBalance();
        }
    }, [account, provider]);

    return (
        <div>
            <h1>Test 1: Connect and Show USDC Balance</h1>
            {account ? (
                <div>
                    <p>Connected account: {account}</p>
                    <p>USDC Contract Address: {USDC_ADDRESS}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    {isLocalhost && (
                        <div>
                            <button onClick={handleMint} disabled={minting} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                {minting ? 'Minting...' : 'Mint 100 USDC'}
                            </button>
                            <p style={{ fontSize: '0.8em', color: '#666' }}>(Only available on localhost)</p>
                        </div>
                    )}
                </div>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from '../abi/contract-addresses.json';
import { useWeb3 } from '../context/Web3Context';
import Button from '../components/Button';

export default function Test1USDC() {
    const { account, provider, network } = useWeb3();
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [usdcAddress, setUsdcAddress] = useState(null);

    const getAddresses = async () => {
        if (provider) {
            const net = await provider.getNetwork();
            return net.chainId.toString() === '31337' ? contractAddresses.localhost : contractAddresses.sepolia;
        }
        return contractAddresses.localhost;
    };

    const getUsdcAbi = async () => {
        if (provider) {
            const net = await provider.getNetwork();
            return net.chainId.toString() === '31337' ? MintableERC20 : OfficialUSDC;
        }
        return MintableERC20;
    };

    const mintUsdc = async () => {
        if (account && provider) {
            const addresses = await getAddresses();
            const USDC_ABI = await getUsdcAbi();
            const signer = await provider.getSigner();
            const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, signer);
            try {
                const tx = await usdcContract.mint(account, ethers.parseUnits("1000", 6));
                await tx.wait();
                updateBalance();
            } catch (error) {
                console.error("Error minting USDC", error);
            }
        }
    };

    const updateBalance = async () => {
        if (account && provider) {
            const addresses = await getAddresses();
            setUsdcAddress(addresses.USDC);
            const USDC_ABI = await getUsdcAbi();
            const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, provider);
            const balance = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(balance, 6));
        }
    };

    useEffect(() => {
        updateBalance();
    }, [account, provider, network]);

    return (
        <div>
            <h1>Test 1: USDC Balance</h1>
            {account ? (
                <div>
                    <p>
                        Connected account: {' '}
                        {network && network.chainId.toString() === '11155111' ? (
                            <a href={`https://sepolia.etherscan.io/address/${account}`} target="_blank" rel="noopener noreferrer" style={{ color: 'lightblue', textDecoration: 'underline' }}>
                                {account}
                            </a>
                        ) : (
                            account
                        )}
                    </p>
                    <p>USDC Address: {usdcAddress}</p>
                    <p>USDC Balance: {usdcBalance}</p>
                    {network && network.chainId.toString() === '11155111' ? (
                        <div>
                            <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'lightblue', textDecoration: 'underline' }}>
                                Get Sepolia USDC from Faucet
                            </a>
                        </div>
                    ) : (
                        <Button onClick={mintUsdc}>Mint 1000 USDC (Localhost only)</Button>
                    )}
                    {network && network.chainId.toString() === '11155111' && (
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
                <p>Please connect your wallet.</p>
            )}
        </div>
    );
}
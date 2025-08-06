import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import NetworkSwitcher from './NetworkSwitcher';

import Button from './Button';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from '../abi/contract-addresses.json';

export default function Navbar() {
  const { account, provider, network, connectWallet, disconnectWallet } = useWeb3();
  const [usdcBalance, setUsdcBalance] = useState(null);

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

  useEffect(() => {
    const updateBalance = async () => {
        if (account && provider) {
            const addresses = await getAddresses();
            const USDC_ABI = await getUsdcAbi();
            const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, provider);
            const balance = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(balance, 6));
        }
    };
    updateBalance();
  }, [account, provider, network]);

  return (
    <nav style={{ padding: '1rem', borderBottom: '2px solid #444', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ color: 'lightblue', margin: 0 }}>YesNo</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
        <NetworkSwitcher />
        {account ? (
          <div>
            <span style={{ color: 'white', marginRight: '1rem' }}>USDC: {usdcBalance}</span>
            <span style={{ color: 'white', marginRight: '1rem' }}>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
            <Button onClick={disconnectWallet}>Disconnect</Button>
          </div>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </div>
    </nav>
  );
}
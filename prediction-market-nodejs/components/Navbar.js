import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { useMode } from '../context/ModeContext';
import NetworkSwitcher from './NetworkSwitcher';
import VersionSwitcher from './VersionSwitcher';
import Button from './Button';
import MintableERC20 from '../abi/MintableERC20.json';
import OfficialUSDC from '../abi/OfficialUSDC.json';
import PredictionMarketFactory from '../abi/PredictionMarketFactory.json';
import contractAddresses from '../abi/contract-addresses.json';

export default function Navbar() {
  const { account, provider, network, connectWallet, disconnectWallet } = useWeb3();
  const { mode, setMode } = useMode();
  const [usdcBalance, setUsdcBalance] = useState(null);

  const getAddresses = async () => {
      if (provider) {
          const net = await provider.getNetwork();
          const chainId = net.chainId.toString();
          const addresses = chainId === '31337' ? contractAddresses.localhost : contractAddresses.sepolia;
          if (chainId === '31337' && addresses.MintableERC20) {
              addresses.USDC = addresses.MintableERC20;
          }
          return addresses;
      }
      const addresses = contractAddresses.localhost;
      if (addresses.MintableERC20) {
          addresses.USDC = addresses.MintableERC20;
      }
      return addresses;
  };

  const getUsdcAbi = async () => {
      if (provider) {
          const net = await provider.getNetwork();
          return net.chainId.toString() === '31337' ? MintableERC20 : OfficialUSDC;
      }
      return MintableERC20;
  };

  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    const updateBalance = async () => {
        if (account && provider) {
            const addresses = await getAddresses();
            const USDC_ABI = await getUsdcAbi();
            const usdcContract = new ethers.Contract(addresses.USDC, USDC_ABI, provider);
            console.log(account);
            console.log(addresses.USDC);
            const balance = await usdcContract.balanceOf(account);
            setUsdcBalance(ethers.formatUnits(balance, 6));
        }
    };

    const checkWhitelist = async () => {
        if (account && provider) {
            const addresses = await getAddresses();
            const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, PredictionMarketFactory, provider);
            const whitelisted = await factoryContract.whitelist(account);
            setIsWhitelisted(whitelisted);
        }
    };

    updateBalance();
    checkWhitelist();
  }, [account, provider, network]);

  return (
    <nav style={{ padding: '1rem', borderBottom: '2px solid #444', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ color: 'lightblue', margin: 0 }}>YesNo</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <VersionSwitcher />
        <a href="/events" style={{ color: 'white', marginRight: '1rem' }}>Events</a>
        <NetworkSwitcher />
        {isWhitelisted && (
            <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginLeft: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                <option value="developer">Developer</option>
                <option value="user">User</option>
            </select>
        )}
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

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import React from 'react';
import { NetworkProvider } from '../context/NetworkContext';
import NetworkSwitcher from './NetworkSwitcher';

export default function Layout({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
        setProvider(null);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = await web3Provider.getSigner();
        const address = signer.address;
        setAccount(address);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  return (
    <NetworkProvider>
      <div style={{ display: 'flex' }}>
        <nav style={{ width: '200px', borderRight: '1px solid #ccc', padding: '20px' }}>
          <h2>Tests</h2>
          <NetworkSwitcher provider={provider} />
          {account ? (
            <div>
              <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
              <button onClick={disconnectWallet} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>Deactivate</button>
            </div>
          ) : (
            <button onClick={connectWallet} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>Connect Wallet</button>
          )}
          <ul>
            <li>
              <Link href="/test0-connect">Connect</Link>
            </li>
            <li>
              <Link href="/test1-USDC">USDC Balance</Link>
            </li>
            <li>
              <Link href="/test2-contract">Deploy Market</Link>
            </li>
            <li>
              <Link href="/test3-bet">Place Bet</Link>
            </li>
            <li>
              <Link href="/test4-contractNway">Deploy N-Way Market</Link>
            </li>
            <li>
              <Link href="/test5-bet">Place N-Way Bet</Link>
            </li>
            <li>
              <Link href="/test6-agent">Agent</Link>
            </li>
          </ul>
        </nav>
        <main style={{ flex: 1, padding: '20px' }}>
          {React.cloneElement(children, { account, provider })}
        </main>
      </div>
    </NetworkProvider>
  );
}
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import React from 'react';

export default function Layout({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <nav style={{ width: '200px', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h2>Tests</h2>
        {account ? (
          <div>
            <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
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
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '20px' }}>
        {React.cloneElement(children, { account, provider })}
      </main>
    </div>
  );
}
import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import NetworkSwitcher from './NetworkSwitcher';
import VersionSwitcher from './VersionSwitcher';
import Button from './Button';

export default function Navbar() {
  const { account, connectWallet, disconnectWallet } = useWeb3();

  return (
    <nav style={{ padding: '1rem', borderBottom: '2px solid #444', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ color: 'lightblue', margin: 0 }}>YesNo</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <VersionSwitcher />
        <NetworkSwitcher />
        {account ? (
          <div>
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

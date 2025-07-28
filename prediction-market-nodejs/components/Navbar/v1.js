import { ethers } from 'ethers';
import Link from 'next/link';

export default function VersionedNavbar({ version, account, setAccount, setProvider }) {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        let web3Provider;
        if (version === 'market-v0') {
          // Ethers.js provider for market-v0
          web3Provider = new ethers.BrowserProvider(window.ethereum);
        } else if (version === 'market-nway') {
          // Ethers.js provider for market-nway
          // For future flexibility, you could use a different web3 provider here.
          // For example:
          // web3Provider = new ThirdwebProvider(window.ethereum);
          web3Provider = new ethers.BrowserProvider(window.ethereum);
        }

        if (web3Provider) {
            setProvider(web3Provider);
            await web3Provider.send("eth_requestAccounts", []);
            const signer = await web3Provider.getSigner();
            const address = signer.address;
            setAccount(address);
        }
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

  const marketV0Links = (
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
  );

  const marketNWayLinks = (
    <ul>
      <li>
        <Link href="/test0-connect">Connect</Link>
      </li>
      <li>
        <Link href="/test1-USDC">USDC Balance</Link>
      </li>
      <li>
        <Link href="/test4-contractNway">Deploy N-Way Market</Link>
      </li>
      <li>
        <Link href="/test5-bet">Place N-Way Bet</Link>
      </li>
    </ul>
  );

  return (
    <nav style={{ width: '200px', borderRight: '1px solid #ccc', padding: '20px' }}>
      {version === 'market-v0' && <h2>Market V0</h2>}
      {version === 'market-nway' && <h2>Market N-Way</h2>}
      <div>
        {account ? (
          <div>
            <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
            <button onClick={disconnectWallet} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>Deactivate</button>
          </div>
        ) : (
          <button onClick={connectWallet} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>Connect Wallet</button>
        )}
      </div>
      {version === 'market-v0' && marketV0Links}
      {version === 'market-nway' && marketNWayLinks}
    </nav>
  );
}

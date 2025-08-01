import { useWeb3 } from '../context/Web3Context';

export default function NetworkSwitcher() {
  const { network, switchNetwork } = useWeb3();

  if (!network) return null;

  return (
    <div style={{ marginRight: '1rem' }}>
      <select
        onChange={(e) => switchNetwork(e.target.value)}
        value={network.chainId}
        style={{ backgroundColor: '#333', color: 'white', padding: '8px', borderRadius: '5px', border: '1px solid #555' }}
      >
        <option value="31337">Localhost</option>
        <option value="11155111">Sepolia</option>
      </select>
    </div>
  );
}

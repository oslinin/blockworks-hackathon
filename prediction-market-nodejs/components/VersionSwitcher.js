import { useVersion } from '../context/VersionContext';

export default function VersionSwitcher() {
  const { version, setVersion } = useVersion();

  return (
    <div style={{ marginRight: '1rem' }}>
      <select
        onChange={(e) => setVersion(e.target.value)}
        value={version}
        style={{ backgroundColor: '#333', color: 'white', padding: '8px', borderRadius: '5px', border: '1px solid #555' }}
      >
        <option value="fixed">Fixed Model</option>
        <option value="amm">AMM</option>
      </select>
    </div>
  );
}

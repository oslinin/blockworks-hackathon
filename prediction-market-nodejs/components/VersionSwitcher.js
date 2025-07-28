
import { useVersion } from '@/context/VersionContext';

export default function VersionSwitcher() {
  const { version, setVersion } = useVersion();

  const handleVersionChange = (e) => {
    setVersion(e.target.value);
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
      <select value={version} onChange={handleVersionChange} style={{ padding: '8px', borderRadius: '4px' }}>
        <option value="v1">Version 1</option>
        <option value="v2">Version 2</option>
      </select>
    </div>
  );
}

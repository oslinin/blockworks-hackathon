
import { createContext, useContext, useState, useEffect } from 'react';

const VersionContext = createContext();

export function VersionProvider({ children }) {
  const [version, setVersion] = useState('v1');

  useEffect(() => {
    const storedVersion = localStorage.getItem('appVersion');
    if (storedVersion) {
      setVersion(storedVersion);
    }
  }, []);

  const handleSetVersion = (newVersion) => {
    setVersion(newVersion);
    localStorage.setItem('appVersion', newVersion);
    // We can reload to make sure all components are re-rendered with the new version
    // window.location.reload();
  };

  return (
    <VersionContext.Provider value={{ version, setVersion: handleSetVersion }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  return useContext(VersionContext);
}

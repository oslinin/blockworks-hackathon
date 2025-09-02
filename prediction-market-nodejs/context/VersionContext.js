import { createContext, useState, useContext } from 'react';

const VersionContext = createContext();

export function VersionProvider({ children }) {
    const [version, setVersion] = useState('fixed'); // 'fixed' or 'amm'

    return (
        <VersionContext.Provider value={{ version, setVersion }}>
            {children}
        </VersionContext.Provider>
    );
}

export function useVersion() {
    return useContext(VersionContext);
}

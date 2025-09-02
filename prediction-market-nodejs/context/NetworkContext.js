import { createContext, useContext, useState } from 'react';

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
    const [network, setNetwork] = useState('localhost');

    return (
        <NetworkContext.Provider value={{ network, setNetwork }}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    return useContext(NetworkContext);
}

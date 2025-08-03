import { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export function useMode() {
    return useContext(ModeContext);
}

export function ModeProvider({ children }) {
    const [mode, setMode] = useState('developer');

    const value = {
        mode,
        setMode,
    };

    return (
        <ModeContext.Provider value={value}>
            {children}
        </ModeContext.Provider>
    );
}

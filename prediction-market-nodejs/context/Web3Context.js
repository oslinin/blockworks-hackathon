import { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [signer, setSigner] = useState(null);
    const [network, setNetwork] = useState(null);

    const supportedNetworks = {
        '31337': {
            chainId: '0x7A69', // 31337
            chainName: 'Localhost 8545',
            nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: ['http://127.0.0.1:8545'],
        },
        '11155111': {
            chainId: '0xaa36a7', // 11155111
            chainName: 'Sepolia',
            nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'SepoliaETH',
                decimals: 18,
            },
            rpcUrls: ['https://rpc.sepolia.org'],
        },
    };

    const updateNetwork = async (provider) => {
        const net = await provider.getNetwork();
        setNetwork(net);
    };

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const newProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(newProvider);
                await updateNetwork(newProvider);

                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    const newAccount = accounts[0];
                    setAccount(newAccount);
                    const newSigner = await newProvider.getSigner();
                    setSigner(newSigner);
                }
            }
        };
        init();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newProvider = provider || new ethers.BrowserProvider(window.ethereum);
                if (!provider) {
                    setProvider(newProvider);
                }

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const newAccount = accounts[0];
                setAccount(newAccount);

                const newSigner = await newProvider.getSigner();
                setSigner(newSigner);
                await updateNetwork(newProvider);
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        } else {
            console.error("Please install MetaMask!");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setNetwork(null);
    };

    const switchNetwork = async (chainId) => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: supportedNetworks[chainId].chainId }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [supportedNetworks[chainId]],
                        });
                    } catch (addError) {
                        console.error("Failed to add network", addError);
                    }
                } else {
                    console.error("Failed to switch network", switchError);
                }
            }
        }
    };

    useEffect(() => {
        const handleAccountsChanged = () => {
            window.location.reload();
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [provider]);

    return (
        <Web3Context.Provider value={{ provider, account, signer, network, connectWallet, disconnectWallet, switchNetwork }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
}

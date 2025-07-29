import { useNetwork } from '../context/NetworkContext';

export default function NetworkSwitcher({ provider }) {
    const { network, setNetwork } = useNetwork();

    const handleChange = async (e) => {
        const newNetwork = e.target.value;
        setNetwork(newNetwork);

        if (newNetwork === 'sepolia' && window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0xaa36a7',
                                    chainName: 'Sepolia',
                                    rpcUrls: ['https://sepolia.infura.io/v3/'],
                                    nativeCurrency: {
                                        name: 'Sepolia Ether',
                                        symbol: 'SEP',
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                                },
                            ],
                        });
                    } catch (addError) {
                        console.error('Failed to add the Sepolia network to MetaMask', addError);
                    }
                }
                console.error('Failed to switch to the Sepolia network', switchError);
            }
        }
    };

    return (
        <select value={network} onChange={handleChange} style={{
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'pointer'
        }}>
            <option value="localhost">Localhost</option>
            <option value="sepolia">Sepolia</option>
        </select>
    );
}

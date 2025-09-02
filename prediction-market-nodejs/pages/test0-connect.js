import { useWeb3 } from '../context/Web3Context';

export default function Test0Connect() {
    const { account, connectWallet, disconnectWallet } = useWeb3();

    return (
        <div>
            <h1>Test 0: Connect Wallet</h1>
            {account ? (
                <div>
                    <p>Connected: {account}</p>
                    <button onClick={disconnectWallet}>Disconnect</button>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
}

export default function Test0Connect({ account }) {
    return (
        <div>
            <h1>Test 0: Connect to MetaMask</h1>
            {account ? (
                <p>Connected account: {account}</p>
            ) : (
                <p>Please connect your wallet using the button in the sidebar.</p>
            )}
        </div>
    );
}
import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";

export default function ConnectButton() {
  const address = useAddress();
  const disconnect = useDisconnect();

  if (address) {
    return (
      <button
        onClick={disconnect}
        style={{
          background: "#333",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Deactivate
      </button>
    );
  }

  return <ConnectWallet theme="dark" btnTitle="Connect Wallet" />;
}

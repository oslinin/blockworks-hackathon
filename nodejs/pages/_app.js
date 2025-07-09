import "@/styles/globals.css";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const chains = [mainnet, sepolia];

const config = createConfig(
  getDefaultConfig({
    appName: "Prediction Market",
    chains,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    // Required API Key for WalletConnect.
    // Get your own at https://cloud.walletconnect.com
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  })
);

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

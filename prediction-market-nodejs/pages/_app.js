import "@/styles/globals.css";
import { ThirdwebProvider, Sepolia } from "@thirdweb-dev/react";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={Sepolia} clientId="YOUR_CLIENT_ID">
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
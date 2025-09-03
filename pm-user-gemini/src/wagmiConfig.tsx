import { createConfig, http } from "wagmi";
import {
    mainnet,
    optimism,
    arbitrum,
    base,
    zksync,
    sepolia,
    anvil,
} from "wagmi/chains";
import { injected, walletConnect, gemini } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig({
    chains: [mainnet, optimism, arbitrum, base, zksync, sepolia, anvil],
    connectors: [
        injected(),
        walletConnect({
            projectId,
        }),
        gemini(),
    ],
    transports: {
        [mainnet.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
        [zksync.id]: http(),
        [sepolia.id]: http(),
        [anvil.id]: http(),
    },
    ssr: false,
});
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useState } from "react"
import { PrivyProvider } from "@privy-io/react-auth"

export function Providers(props: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <PrivyProvider
            appId="YOUR_PRIVY_APP_ID" // Replace with your Privy app ID
            config={{
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets'
                    }
                }
            }}
        >
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </PrivyProvider>
    )
}

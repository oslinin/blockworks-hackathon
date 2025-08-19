import "./globals.css"
import type { Metadata } from "next"
import { type ReactNode } from "react"
import Header from "@/components/Header"
import Provider from "./privy-provider"

export const metadata: Metadata = {
    title: "TSender",
    description: "Hyper gas-optimized bulk ERC20 token transfer",
}

export default function RootLayout(props: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/T-Sender.svg" sizes="any" />
            </head>
            <body className="bg-zinc-50">
                <Provider>
                    <Header />
                    {props.children}
                </Provider>
            </body>
        </html>
    )
}

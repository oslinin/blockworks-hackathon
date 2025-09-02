import "./globals.css"
import type { Metadata } from "next"
import { type ReactNode } from "react"
import Header from "@/components/Header"
import Provider from "./privy-provider"

export const metadata: Metadata = {
    title: "YesNo",
    description: "Yes No market",
}

export default function RootLayout(props: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/T-Sender.svg" sizes="any" />
            </head>
            <body className="bg-zinc-50">
                <Provider>
                    <main>
                        <Header />
                        {props.children}
                    </main>
                </Provider>
            </body>
        </html>
    )
}

// This file is to show what making a connect button looks like behind the scenes!
//localstorage in background visible in browser

import { useEffect } from "react" //core hook from react  https://legacy.reactjs.org/docs/hooks-effect.html
import { useMoralis } from "react-moralis"

// Top navbar
export default function ManualHeader() {
    const {
        enableWeb3,
        isWeb3Enabled, //keeps track of wether web3 is enabled
        isWeb3EnableLoading, //checks for metamask
        account, // the current account
        Moralis,
        deactivateWeb3,
    } = useMoralis()

    // dependency array: [isWeb3Enabled]
    // no dependency array, runs on every render
    // empty array, runs once
    // dependency array, runs when the stuff in it changes
    useEffect(() => {
        //if anything changes, change dependency array.  running all the time
        if (
            !isWeb3Enabled && //keep checking
            typeof window !== "undefined" &&
            window.localStorage.getItem("connected")
        ) {
            enableWeb3()
            // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
        }
    }, [isWeb3Enabled])
    // no array, run on every render
    // empty array, run once
    // dependency array, run when the stuff in it changesan

    useEffect(() => {
        Moralis.onAccountChanged((newAccount) => {
            console.log(`Account changed to ${newAccount}`)
            if (newAccount == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])

    return (
        <nav className="p-5 border-b-2">
            <ul className="">
                <li className="flex flex-row">
                    {account ? (
                        <div className="ml-auto py-2 px-4">
                            Connected to {account.slice(0, 6)}
                            ...
                            {account.slice(account.length - 4)}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                // await walletModal.connect()
                                const ret = await enableWeb3()
                                if (typeof ret !== "undefined") {
                                    // depends on what button they picked
                                    if (typeof window !== "undefined") {
                                        window.localStorage.setItem(
                                            "connected",
                                            "injected"
                                        )
                                        // window.localStorage.setItem("connected", "walletconnect")
                                    }
                                }
                            }}
                            disabled={isWeb3EnableLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        >
                            Connect
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    )
}

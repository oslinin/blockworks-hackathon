import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit" //dispatch
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex) //hex to decimal
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log(`raffle chainID = ${chainId}`)
    console.log(`raffle contract address = ${raffleAddress}`)
    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
            <div>Please connect to a supported chain </div>
        </div>
    )
}

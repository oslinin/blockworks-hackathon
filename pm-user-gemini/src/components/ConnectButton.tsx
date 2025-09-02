"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { formatAddress } from '@/utils/formatAddress';


export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-zinc-800">{formatAddress(address as `0x${string}`)}</p>
        <button onClick={() => disconnect()} className="px-4 py-2 text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div>
      {connectors.filter(c => c.name !== 'Injected').map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })} className="px-4 py-2 mr-2 text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
          {connector.name}
        </button>
      ))}
    </div>
  )
}

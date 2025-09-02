"use client";

import { usePrivy } from '@privy-io/react-auth';
import { formatAddress } from '@/utils/formatAddress';

export function ConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return <button className="px-4 py-2 text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors" disabled>Loading...</button>;
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-zinc-800">{formatAddress(user?.wallet?.address as `0x${string}`)}</p>
        <button onClick={logout} className="px-4 py-2 text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
          Logout
        </button>
      </div>
    );
  }

  return (
    <button onClick={login} className="px-4 py-2 text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
      Login
    </button>
  );
}

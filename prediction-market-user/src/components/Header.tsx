"use client"

import {usePrivy} from '@privy-io/react-auth';

export default function Header() {
  const {ready, authenticated, user, login, logout} = usePrivy();
  // Wait until the Privy client is ready before taking any actions
  if (!ready) {
    return null;
  }

  return (
    <header className="px-8 py-4.5 border-b-[1px] border-zinc-100 flex flex-row justify-between items-center bg-white xl:min-h-[77px]">
      <h1 className="text-2xl font-semibold">YesNo</h1>
      <div className="flex items-center gap-4">
        {authenticated ? (
          <>
            <p className="text-sm text-zinc-500">{user?.wallet?.address}</p>
            <button
              onClick={logout}
              className="bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

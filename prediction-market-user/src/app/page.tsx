'use client';

import {usePrivy} from '@privy-io/react-auth';

export default function Home() {
  const {ready, authenticated, user, login} = usePrivy();

  if (!ready) {
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen -mt-20">
      {authenticated ? (
        <div>
          <h1 className="text-2xl font-bold">Welcome to YesNo</h1>
          <p className="mt-4">You are logged in as:</p>
          <pre className="mt-2 p-4 bg-gray-100 rounded-md">
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Welcome to YesNo</h1>
          <p className="mt-4">Please log in to place a bet.</p>
          <button
            onClick={login}
            className="mt-6 bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
          >
            Login
          </button>
        </div>
      )}
    </main>
  );
}

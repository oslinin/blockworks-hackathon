import Link from 'next/link';
import React from 'react';
import Navbar from './Navbar';
import { useVersion } from '../context/VersionContext';

export default function Layout({ children }) {
  const { version } = useVersion();

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <nav style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px' }}>
          <h2>Tests</h2>
          <ul>
            <li>
              <Link href="/test0-connect">Connect</Link>
            </li>
            <li>
              <Link href="/test1-USDC">USDC Balance</Link>
            </li>
            <li>
              <Link href="/test6-agent">Agent</Link>
            </li>
            <li>
              <Link href="/test7-agent">Agent (Bare Bones)</Link>
            </li>
            {version === 'amm' && (
              <>
                <li>
                  <Link href="/test2-contract">Deploy Market</Link>
                </li>
                <li>
                  <Link href="/test3-bet">Place Bet</Link>
                </li>
                <li>
                  <Link href="/test4-contractNway">Deploy N-Way Market</Link>
                </li>
                <li>
                  <Link href="/test5-bet">Place N-Way Bet</Link>
                </li>
              </>
            )}
            {version === 'fixed' && (
              <>
                <li>
                  <Link href="/test8-contract-fixedmarket">Deploy Fixed-Model Market</Link>
                </li>
                <li>
                  <Link href="/test9-bet">Place Bet (Fixed-Model)</Link>
                </li>
                <li>
                  <Link href="/test10-contractNway-fixedmarket">Deploy N-Way Fixed-Model Market</Link>
                </li>
                <li>
                  <Link href="/test11-bet-fixedmarket">Place Bet (N-Way Fixed-Model)</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
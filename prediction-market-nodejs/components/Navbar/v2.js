
import Link from 'next/link';

export default function NavbarV2() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '2px solid #444', background: '#222' }}>
      <h1 style={{ color: 'lightblue' }}>Prediction Market - V2 Interface</h1>
      <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link href="/test0-connect" style={{ marginRight: '1rem' }}>Connect</Link>
    </nav>
  );
}

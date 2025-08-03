import '../styles/globals.css';
import { Web3Provider } from '../context/Web3Context';
import { VersionProvider } from '../context/VersionContext';
import { ModeProvider } from '../context/ModeContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <VersionProvider>
        <ModeProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ModeProvider>
      </VersionProvider>
    </Web3Provider>
  );
}

export default MyApp;

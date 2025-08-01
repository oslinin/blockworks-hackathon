import '../styles/globals.css';
import { Web3Provider } from '../context/Web3Context';
import { VersionProvider } from '../context/VersionContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <VersionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </VersionProvider>
    </Web3Provider>
  );
}

export default MyApp;

import { StoreProvider } from '../contexts/storeContext';
import { AuthProvider } from '../contexts/authContext';
import { PublicProvider } from '../contexts/publicContext';
import '../styles/globals.css';
import '../../public/font/font.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Head from 'next/head';
import '../styles/App.css';
import config from '../../config';
import Chatbot from './mumulChatBotMSG';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon1.ico" type="image/x-icon" />
        <title>MUMUL</title>
      </Head>

      <AuthProvider>
        <PublicProvider>
          <StoreProvider>
            <Component {...pageProps} />
          </StoreProvider>
        </PublicProvider>
      </AuthProvider>

      <Chatbot agentId={config.agentID} />
    </>
  );
}

export default MyApp;

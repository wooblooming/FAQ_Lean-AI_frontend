import { StoreProvider } from '../contexts/storeContext';
import '../styles/globals.css';
import '../../public/font/font.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import Head from 'next/head';  // Next.js의 Head 컴포넌트 임포트
import '../styles/App.css'  // App.css가 필요한 경우에만 포함
import config from '../../config';
import Chatbot from './mumulChatBotMSG';


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon1.ico" type="image/x-icon"/>
        <title>MUMUL</title>
      </Head>

      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>

      <Chatbot agentId={config.agentID}/>
    </>
  );
}

export default MyApp;
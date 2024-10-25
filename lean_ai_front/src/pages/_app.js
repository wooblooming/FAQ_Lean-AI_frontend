import { StoreProvider } from '../contexts/storeContext';
import '../styles/globals.css';
import '../../public/font/font.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '../styles/App.css'  // App.css가 필요한 경우에만 포함


function MyApp({ Component, pageProps }) {
  return (
    <>
      <head>
      <link rel="apple-touch-icon" type="image/png" href="/mumul_icon.png" sizes="96x96" />
      </head>

      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </>
  );
}

export default MyApp;
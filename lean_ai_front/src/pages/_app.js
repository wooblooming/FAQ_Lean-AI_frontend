import { StoreProvider } from "../contexts/storeContext";
import { AuthProvider } from "../contexts/authContext";
import { PublicProvider } from "../contexts/publicContext";
import Script from "next/script";
import "../styles/globals.css";
import "../../public/font/font.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import "../styles/App.css";
import Chatbot from "./mumulChatBotMSG";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PublicProvider>
        <StoreProvider>
          <Component {...pageProps} />
          <Chatbot agentId={process.env.NEXT_PUBLIC_AGENT_ID} />
          <Script
            src=" https://testspay.kcp.co.kr/plugin/kcp_spay_hub.js" // 테스트
            //src="https://spay.kcp.co.kr/plugin/kcp_spay_hub.js" // 실제
            strategy="beforeInteractive"
            onLoad={() => console.log("KCP 스크립트 로드 완료")}
          />
        </StoreProvider>
      </PublicProvider>
    </AuthProvider>
  );
}

export default MyApp;
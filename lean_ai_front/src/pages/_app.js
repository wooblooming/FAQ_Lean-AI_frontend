import { useRouter } from "next/router";
import { StoreProvider } from "../contexts/storeContext";
import { AuthProvider } from "../contexts/authContext";
import { PublicProvider } from "../contexts/publicContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Script from "next/script";
import "../styles/globals.css";
import "../../public/font/font.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import "../styles/App.css";
import Chatbot from "./mumulChatBotMSG";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // 특정 페이지에서 Chatbot 숨기기
  const hideChatbotPages = ["/storeIntroductionExample/[slug]"];
  const isChatbotHidden = hideChatbotPages.some((path) =>
    router.pathname.startsWith(path)
  );

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY}
    >
      <AuthProvider>
        <PublicProvider>
          <StoreProvider>
            <Component {...pageProps} />
            {/* 특정 페이지에서 Chatbot을 숨김 */}
            {!isChatbotHidden && (
              <Chatbot agentId={process.env.NEXT_PUBLIC_AGENT_ID} />
            )}
            <Script
              src="https://testspay.kcp.co.kr/plugin/kcp_spay_hub.js" // 테스트
              //src="https://spay.kcp.co.kr/plugin/kcp_spay_hub.js" // 실제
              strategy="beforeInteractive"
              onLoad={() => console.log("KCP 스크립트 로드 완료")}
            />
          </StoreProvider>
        </PublicProvider>
      </AuthProvider>
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;

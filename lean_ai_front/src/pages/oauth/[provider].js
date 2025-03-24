import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoginType } from "@/contexts/loginTypeContext";
import { useStore } from "@/contexts/storeContext";
import useConvertToJwtToken from "@/hooks/useConvertToJwtToken";

const OAuthPage = () => {
  const router = useRouter();
  const { loginType } = useLoginType();
  const { setStoreID } = useStore(); // 스토어 ID 상태 설정
  const [isRedirecting, setIsRedirecting] = useState(false); // 리디렉션 진행 여부 상태
  const { convertToJwtToken } = useConvertToJwtToken(); // JWT 변환 훅 사용

  useEffect(() => {
    // 라우터가 준비되지 않았다면 실행하지 않음
    if (!router.isReady) return;

    // OAuth 제공자(provider)와 인증 코드(code) 가져오기
    const { provider, code } = router.query;

    // provider 또는 code가 없으면 오류 처리
    if (!provider || !code) {
      console.error("❌ [ERROR] OAuth 파라미터가 없습니다.");
      return;
    }

    // OAuth 인증 처리 함수
    const handleOAuth = async () => {
      setIsRedirecting(true); // 리디렉션 상태 활성화

      try {
        // 백엔드로 OAuth 토큰 요청
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/oauth-token/`,
          { provider, code }, // 요청 본문에 provider와 code 포함
          { headers: { "Content-Type": "application/json" } }
        );

        // 응답 데이터에서 필요한 값 추출
        const { access_token, user_data, social_signup, store_id } =
          response.data;

        // access_token이 없으면 오류 처리
        if (!access_token) throw new Error("❌ [ERROR] 토큰이 없습니다.");

        // 세션 스토리지에 토큰 저장
        sessionStorage.setItem("token", access_token);

        let redirectPath = ""; // 리디렉션 경로 설정

        if (social_signup) {
          // 소셜 회원가입 유저인 경우 추가 정보 입력 페이지로 이동
          sessionStorage.setItem("signupUserData", JSON.stringify(user_data));
          sessionStorage.setItem("isOAuthUser", "true");
          redirectPath = "/signupStep2";
        } else {
          // 기존 사용자 로그인 처리
          setStoreID(store_id); // 스토어 ID 설정
          sessionStorage.setItem("user_data", JSON.stringify(user_data));

          // JWT 변환 실행
          const jwtToken = await convertToJwtToken(user_data);

          if (!jwtToken) {
            console.error("❌ [ERROR] JWT 변환 실패");
            redirectPath = "/login?error=jwt_failed"; // JWT 변환 실패 시 로그인 페이지로 이동
          } else {
            const hasSubscription = user_data?.billing_key?.is_active || false;

            // 구독 여부에 따라 이동할 페이지 결정 -> 구독 설정 후 추가
            /*
           let redirectPath;

            if (hasSubscription) {
              redirectPath =
                loginType === "public"
                  ? "/mainPageForPublic"
                  : loginType === "corporation"
                  ? "/mainPageForCorp"
                  : "/mainPage";
            } else {
              redirectPath = "/subscriptionPlans";
            }
*/

            // 현재는 구독 여부와 상관없이 메인 페이지로 이동
            if (loginType === "public") {
              redirectPath = "/mainPageForPublic";
            } else if (loginType === "corporation") {
              redirectPath = "/mainPageForCorp";
            } else {
              redirectPath = "/mainPage";
            }
          }
        }

        // 일정 시간(700ms) 후 리디렉션 수행
        setTimeout(() => {
          router.replace(redirectPath);
        }, 700);
      } catch (error) {
        console.error("❌ [ERROR] OAuth 오류:", error);
        setIsRedirecting(true);

        // 오류 발생 시 로그인 페이지로 이동 (500ms 후)
        setTimeout(() => router.replace("/login?error=auth_failed"), 500);
      }
    };

    handleOAuth();
  }, [router.isReady, router]); // router.isReady가 변경될 때 실행

  // 리디렉션 중일 때 로딩 UI 표시
  if (isRedirecting) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <LoadingSpinner className="w-32 h-32" />
        <p className="text-xl font-bold text-gray-700">잠시만 기다려 주세요</p>
      </div>
    );
  }
};

export default OAuthPage;

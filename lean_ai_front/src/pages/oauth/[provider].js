import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePublic } from "@/contexts/publicContext";
import { useStore } from "@/contexts/storeContext";
import useConvertToJwtToken from "@/hooks/useConvertToJwtToken";

const OAuthPage = () => {
  const router = useRouter();
  const { isPublicOn } = usePublic();
  const { setStoreID } = useStore();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { convertToJwtToken } = useConvertToJwtToken(); // JWT 변환 훅 사용

  useEffect(() => {
    if (!router.isReady) return;

    const { provider, code } = router.query;

    if (!provider || !code) {
      console.error("❌ [ERROR] OAuth 파라미터가 없습니다.");
      return;
    }

    const handleOAuth = async () => {        
      
      setIsRedirecting(true);

      try {

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/oauth-token/`,
          { provider, code },
          { headers: { "Content-Type": "application/json" } }
        );

        //console.log("✅ [SUCCESS] OAuth 응답 데이터:", response.data);
        const { access_token, user_data, social_signup, store_id } = response.data;

        if (!access_token) throw new Error("❌ [ERROR] 토큰이 없습니다.");

        sessionStorage.setItem("token", access_token);

        let redirectPath = "";

        if (social_signup) {
          sessionStorage.setItem("signupUserData", JSON.stringify(user_data));
          sessionStorage.setItem("isOAuthUser", "true");
          redirectPath = "/signupStep2";
        } else {
          setStoreID(store_id);
          sessionStorage.setItem("user_data", JSON.stringify(user_data));
          //console.log("🔍 [DEBUG] user_data:", user_data);
          
          // 기존 사용자 로그인 시 JWT 변환
          const jwtToken = await convertToJwtToken(user_data);

          if (!jwtToken) {
            console.error("❌ [ERROR] JWT 변환 실패");
            redirectPath = "/login?error=jwt_failed";
          } else {
            const hasSubscription = user_data?.billing_key?.is_active || false;
            /*
            redirectPath = hasSubscription
              ? isPublicOn
                ? "/mainPageForPublic"
                : "/mainPage"
              : "/subscriptionPlans";
*/
            redirectPath = isPublicOn ? "/mainPageForPublic" : "/mainPage";
          }
        }

        setTimeout(() => {
          router.replace(redirectPath);
        }, 700);
      } catch (error) {
        console.error("❌ [ERROR] OAuth 오류:", error);
        setIsRedirecting(true);
        setTimeout(() => router.replace("/login?error=auth_failed"), 500);
      }
    };

    handleOAuth();
  }, [router.isReady, router]);

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

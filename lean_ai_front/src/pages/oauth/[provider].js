// @/pages/oauth/[provider].js
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { usePublic } from "@/contexts/publicContext";

const OAuthPage = () => {
  const router = useRouter();
  const { saveToken } = useAuth();
  const { setStoreID } = useStore();
  const { isPublicOn } = usePublic();

  useEffect(() => {
    if (!router.isReady) return; // ✅ router가 준비될 때까지 기다림

    const { provider, code } = router.query;

    if (!provider || !code) {
      console.error("OAuth 파라미터가 없습니다.");
      router.replace("/login?error=missing_params");
      return;
    }

    const handleOAuth = async () => {
      try {
        // ✅ 토큰 요청
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/oauth-token/`,
          { provider, code },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        // ✅ 응답 데이터 구조 확인
        console.log("OAuth 응답 데이터:", response.data);
    
        const { access, user, store_registration_required } = response.data; // ✅ user_data -> user로 변경
        if (!access) {
          throw new Error("토큰이 없습니다.");
        }
    
        // ✅ 토큰 저장
        await saveToken(access);
    
        let redirectPath = "";
    
        // ✅ store 등록 필요 여부 확인
        if (store_registration_required) {
          // ✅ user가 undefined가 아니면 sessionStorage에 저장
          if (user) {
            sessionStorage.setItem("signupUserData", JSON.stringify({
              username: user.username || "",
              email: user.email || "",
              name: user.name || "",
              dob: user.dob || "",
              phone: user.phone || "",
            }));
            sessionStorage.setItem("isOAuthUser", "true"); // ✅ 소셜 로그인 플래그 추가
          } else {
            console.error("user 데이터가 없습니다.");
          }
    
          redirectPath = "/signupStep2";
        } else {
          const id = isPublicOn ? public_id : store_id;
          setStoreID(id);
    
          // ✅ 구독 여부 확인 (user.billing_key가 존재하는지 체크)
          const hasSubscription = user?.billing_key?.is_active || false;
    
          redirectPath = hasSubscription
            ? isPublicOn
              ? "/mainPageForPublic"
              : "/mainPage"
            : "/subscriptionPlans";
        }
    
        // ✅ 리다이렉트
        setTimeout(() => {
          router.replace(redirectPath);
        }, 100);
      } catch (error) {
        console.error("OAuth 오류:", error);
        setTimeout(() => {
          router.replace("/login?error=auth_failed");
        }, 500);
      }
    };
    

    handleOAuth();
  }, [router.isReady]); // ✅ router.isReady가 변경될 때 실행

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <LoadingSpinner />
      <p className="text-xl font-bold text-gray-700">로그인 처리 중...</p>
    </div>
  );
};

export default OAuthPage;

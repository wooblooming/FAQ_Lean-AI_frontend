import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/authContext";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const useConvertToJwtToken = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const { saveToken } = useAuth(); // JWT 저장을 위한 컨텍스트

  const convertToJwtToken = async (userData) => {
    try {
      setIsConverting(true);
      setError(null);
     
      const accessToken = sessionStorage.getItem("token");
      if (!accessToken) throw new Error("❌ [ERROR] access_token이 없습니다.");

      const response = await axios.post(
        `${API_DOMAIN}/api/oauth-jwt-token/`,
        {
          username: userData.username,
          phone: userData.phone,
          access_token: accessToken, // OAuth에서 받은 소셜 로그인 토큰
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        //console.log("✅ [JWT 변환 성공]:", response.data);
        await saveToken(response.data.access); // JWT 저장
        sessionStorage.setItem("refresh_token", response.data.refresh); // 리프레시 토큰 저장
        return response.data.access;
      } else {
        throw new Error(response.data.message || "JWT 변환 실패");
      }
    } catch (error) {
      console.error("❌ [JWT 변환 오류]:", error);
      setError(error.message);
      return null;
    } finally {
      setIsConverting(false);
    }
  };

  return { convertToJwtToken, isConverting, error };
};

export default useConvertToJwtToken;

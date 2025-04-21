import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLoginType } from "@/contexts/loginTypeContext";
import { useAuth } from "@/contexts/authContext";
import HeroMumulSection from "@/components/component/landingPage/HeroSection"

const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

const DesktopLayout = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { loginType } = useLoginType();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태

  // 세션 스토리지에서 토큰 확인하여 로그인 상태 설정
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true); // 토큰이 존재하면 로그인 상태로 설정
      //console.log("Token exists:", token);
    } else {
      setIsLoggedIn(false); // 토큰이 없으면 비로그인 상태로 설정
      //console.log("No token found, user is not logged in.");
    }
  }, [token]);

  // 버튼 클릭 시 로그인 상태에 따른 페이지 이동
  const handleClick = () => {
    if (isLoggedIn) {
      // 로그인 상태에 따라 페이지 이동
      if (loginType === "public") {
        router.push("/mainPageForPublic");
      } else if (loginType === "corporation") {
        router.push("/mainPageForCorp");
      } else {
        router.push("/mainPage");
      }
    } else {
      router.push("/login");
    }
  };

  // 캐시 버스팅을 위한 이미지 컴포넌트
  const CacheBustedImage = ({ src, alt, width, height, version, ...props }) => {
    const versionedSrc = `${src}?${version}`;
    return (
      <Image
        src={versionedSrc}
        alt={alt}
        width={width}
        height={height}
        {...props}
      />
    );
  };

  // 애니메이션 설정
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div>
      <HeroMumulSection/>
    </div>
  );
};

export default DesktopLayout;

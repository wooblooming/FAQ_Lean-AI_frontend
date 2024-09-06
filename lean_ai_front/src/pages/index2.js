import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';


function LandingMenu() {
  
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // 컴포넌트가 마운트된 이후에만 localStorage에 접근하도록 설정

    if (isMounted) {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    }
  }, [router, isMounted]);

  // 체험하러가기 버튼 로직
  const handleExperienceClick = () => { 
    // 로그인이 되어 있으면 메인페이지로 이동
    if (isLoggedIn) {
      router.push('/mainPageForPresident');
    } 
    // 로그인이 안되어 있으면 로그인 페이지로 이동
    else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col">
      {/* 메뉴바가 있는 헤더 컴포넌트 */}
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <div id="mainContent" className="flex flex-col justify-center items-start h-screen p-6 font-sans">
        <h1 className="text-4xl font-bold text-blue-300">MUMUL</h1>
        <h2 className="text-3xl font-bold mt-2">당신의 번거로움을 줄여주는 챗봇</h2>
        <p className="my-2">
          AI 기술을 이용해 각종 이용객들의 질문을 더는 고민하지 않게 해드립니다.
        </p>
        <button onClick={handleExperienceClick} className="mt-6 bg-red-400 text-white px-4 py-2 rounded">
          체험하러가기
        </button>
      </div>
    </div>
  );
}
export default LandingMenu;

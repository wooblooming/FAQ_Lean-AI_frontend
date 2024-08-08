import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../menu.css'; // 햄버거 메뉴 CSS를 import


function LandingMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      {/* 햄버거 메뉴 */}
      <div className="absolute top-4 right-4 z-20">
        <button id="menuToggle" className="text-3xl focus:outline-none" onClick={toggleMenu}>
          &#9776; {/* 햄버거 메뉴 아이콘 */}
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div id="mainContent" className="flex flex-col justify-center items-start h-screen p-6">
        <h1 className="text-4xl font-bold">LEAN AI</h1>
        <h2 className="text-3xl font-bold mt-2">당신의 번거로움을 줄여주는 챗봇</h2>
        <p className="mt-4">AI 기술을 이용해 각종 이용객들의 질문을 더는 고민하지 않게 해드립니다.</p>
        <Link to="/login" className="mt-6 bg-red-500 text-white px-4 py-2 rounded">체험하러가기</Link>
      </div>

      {/* 풀스크린 오버레이 메뉴 */}
      <div id="fullscreenOverlay" className={`fullscreen-overlay ${menuOpen ? 'flex' : 'hidden'} fixed inset-0 flex-col justify-center items-center text-center`}>
        <h3 className="mt-2 cursor-pointer" id="loginLink1">Log in / Log out</h3>
        <p className="mt-2 cursor-pointer" id="loginLink">마이 페이지</p>
        <p className="mt-2 cursor-pointer" id="noticeLink">공지사항</p>
        <p className="mt-2 cursor-pointer" id="faqLink">자주 묻는 질문</p>
      </div>
    </div>
  );
}

export default LandingMenu;

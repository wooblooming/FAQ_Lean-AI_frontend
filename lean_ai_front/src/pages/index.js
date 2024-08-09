import React, { useState } from 'react';
import Link from 'next/link';

function LandingMenu() {
  // 메뉴의 열림/닫힘 상태를 관리하는 state
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 열림/닫힘 상태를 토글하는 함수
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      {/* 햄버거 메뉴 버튼 */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          id="menuToggle" 
          className="text-3xl focus:outline-none" 
          onClick={toggleMenu} // 버튼 클릭 시 메뉴를 토글
        >
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
            {/* 햄버거 메뉴의 막대들을 구성하는 div들 */}
            <div></div>
            <div></div>
            <div></div>
          </span>
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div id="mainContent" className="flex flex-col justify-center items-start h-screen p-6">
        {/* 메인 타이틀 */}
        <h1 className="text-4xl font-bold">LEAN AI</h1>
        {/* 서브 타이틀 */}
        <h2 className="text-3xl font-bold mt-2">당신의 번거로움을 줄여주는 챗봇</h2>
        {/* 설명 문구 */}
        <p className="mt-4">AI 기술을 이용해 각종 이용객들의 질문을 더는 고민하지 않게 해드립니다.</p>
        {/* 로그인 페이지로 이동하는 버튼 */}
        <Link href="/login">
          <button className="mt-6 bg-red-500 text-white px-4 py-2 rounded">체험하러가기</button>
        </Link>
      </div>

      {/* 풀스크린 오버레이 메뉴 - 메뉴가 열릴 때만 표시됨 */}
      {menuOpen && (
        <div 
          id="fullscreenOverlay" 
          className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-30"
        >
          {/* 오버레이 메뉴의 닫기 버튼 (햄버거 아이콘과 동일) */}
          <button
            className="absolute top-4 right-4 text-3xl text-white focus:outline-none no-blur"
            onClick={toggleMenu} // 클릭 시 메뉴 닫기
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              {/* X자 모양을 만드는 막대들 */}
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          {/* 오버레이 메뉴의 링크들 */}
          <p className="mt-2 cursor-pointer text-white" id="loginLink1">Log in / Log out</p>
          <p className="mt-2 cursor-pointer text-white" id="loginLink">마이 페이지</p>
          <p className="mt-2 cursor-pointer text-white" id="noticeLink">공지사항</p>
          <p className="mt-2 cursor-pointer text-white" id="faqLink">자주 묻는 질문</p>
        </div>
      )}

      {/* 스타일 추가: 햄버거 메뉴 아이콘 및 오버레이 블러 */}
      <style jsx>{`
        /* 햄버거 메뉴 아이콘의 기본 스타일 */
        .menu-icon {
          display: inline-block;
          position: relative;
          width: 30px;
          height: 24px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        /* 햄버거 메뉴 아이콘을 구성하는 막대들 */
        .menu-icon div {
          background-color: black; /* 햄버거 아이콘 줄 색상 */
          height: 3px;
          width: 100%;
          margin: 4px 0;
          transition: all 0.3s ease-in-out;
        }

        /* 햄버거 메뉴가 X자로 변환될 때의 스타일 */
        .menu-icon.open div:nth-child(1) {
          transform: rotate(45deg);
          position: absolute;
          top: 10px;
        }

        /* 중간 막대는 투명하게 처리 */
        .menu-icon.open div:nth-child(2) {
          opacity: 0;
        }

        /* 세 번째 막대도 X자로 변환 */
        .menu-icon.open div:nth-child(3) {
          transform: rotate(-45deg);
          position: absolute;
          top: 10px;
        }

        /* 메뉴가 열릴 때, 배경에 블러 효과를 적용 */
        .fullscreen-overlay {
          background: rgba(0, 0, 0, 0.5); /* 배경색과 투명도 설정 */
          backdrop-filter: blur(10px); /* 블러 필터 적용 */
        }

        /* X자 아이콘에 블러 효과가 적용되지 않도록 방지 */
        .no-blur {
          backdrop-filter: none; /* 블러 처리 방지 */
        }
      `}</style>
    </div>
  );
}

export default LandingMenu;

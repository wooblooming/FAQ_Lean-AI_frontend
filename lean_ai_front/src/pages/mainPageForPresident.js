import React, { useState } from 'react';
import Link from 'next/link';

const MainPageWithMenu = () => {
  // 메뉴의 열림/닫힘 상태를 관리하는 state
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 열림/닫힘 상태를 토글하는 함수
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* 상단 네비게이션 바 */}
      <nav className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">LEAN AI</div>
        <div className="flex space-x-4">
          <Link href="/notification">
            <p className="text-xl flex items-center justify-center w-8 h-8">
              <i className="fas fa-bell"></i>
            </p>
          </Link>
          <button 
            id="menuToggle" 
            className="text-xl flex items-center justify-center w-8 h-8 focus:outline-none" 
            onClick={toggleMenu} // 버튼 클릭 시 메뉴를 토글
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main id="main-content" className="text-center">
        <h1 className="text-xl font-bold mb-4">
          사람이 답할 시간은 끝났습니다.
          <br />
          이제는 로봇이 응답합니다
        </h1>

        {/* 상단 배너 */}
        <div className="bg-gray-300 rounded-lg flex items-center justify-center mb-6 mx-auto" style={{ width: '100%', maxWidth: '500px' }}>
          <img src="banner.png" alt="상단 배너 이미지" className="w-full object-cover rounded-lg" />
        </div>

        {/* 사용자 안내 메시지 */}
        <div className="mb-6 mt-8">
          <h2 className="text-xl font-bold">찬혁떡볶이님을</h2>
          <p className="text-lg">위한 서비스를 준비했어요.</p>
        </div>

        {/* 버튼들 */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/changeInfo" passHref>
            <p className="bg-gray-300 rounded-lg py-8 w-full text-center">기본 정보 등록</p>
          </Link>
          <Link href="/editData" passHref>
            <p className="bg-gray-300 rounded-lg py-8 w-full text-center">FAQ 데이터 등록</p>
          </Link>
        </div>
      </main>

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
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          {/* 오버레이 메뉴의 링크들 */}
          <ul className="space-y-4 text-lg text-white text-center">
            <li><Link href="/login">Log in / Log out</Link></li>
            <li><Link href="/myPage">마이페이지</Link></li>
            <li><Link href="/notification">공지사항</Link></li>
            <li><Link href="/qna">자주 묻는 질문</Link></li>
          </ul>
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
};

export default MainPageWithMenu;

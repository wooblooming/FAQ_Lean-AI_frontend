import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function LandingMenu() {
  // useRouter : 이벤트 있는 페이지 이동시 이용
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
    } else {
      router.push('/login');
    }
  };

  const handleLogoutConfirm = () => {
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    router.push('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const goToMypage = () => {
    if (isLoggedIn) router.push('/mypage');
    else router.push('/login');
  };

  const goToNotice = () => {
    if (isLoggedIn) router.push('/notice');
    else router.push('/login');
  };

  const goToQnA = () => {
    if (isLoggedIn) router.push('/qna');
    else router.push('/login');
  };

  return (
    <div>
      <div className="absolute top-4 right-4 z-20">
        <button
          id="menuToggle"
          className="text-3xl focus:outline-none"
          onClick={toggleMenu}
        >
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
            <div></div>
            <div></div>
            <div></div>
          </span>
        </button>
      </div>

      <div id="mainContent" className="flex flex-col justify-center items-start h-screen p-6">
        <h1 className="text-4xl font-bold">LEAN AI</h1>
        <h2 className="text-3xl font-bold mt-2">당신의 번거로움을 줄여주는 챗봇</h2>
        <p className="mt-4">
          AI 기술을 이용해 각종 이용객들의 질문을 더는 고민하지 않게 해드립니다.
        </p>
        <Link href="/login">
          <button className="mt-6 bg-red-500 text-white px-4 py-2 rounded">체험하러가기</button>
        </Link>
      </div>

      {menuOpen && (
        <div
          id="fullscreenOverlay"
          className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-30"
        >
          <button
            className="absolute top-4 right-4 text-3xl text-white focus:outline-none no-blur"
            onClick={toggleMenu}
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          <p className="mt-2 cursor-pointer text-white" onClick={handleLoginLogoutClick}>Log in / Log out</p>
          <p className="mt-2 cursor-pointer text-white" onClick={goToMypage}>마이 페이지</p>
          <p className="mt-2 cursor-pointer text-white" onClick={goToNotice}>공지사항</p>
          <p className="mt-2 cursor-pointer text-white" onClick={goToQnA}>자주 묻는 질문</p>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">로그아웃하시겠습니까?</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleLogoutConfirm}
            >
              로그아웃
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={handleLogoutCancel}
            >
              취소
            </button>
          </div>
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
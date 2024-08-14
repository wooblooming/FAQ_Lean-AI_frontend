import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function LandingMenu() {
  // useRouter : 페이지 이동시 이벤트 처리를 위한 훅
  const router = useRouter();

  // useState를 사용해 상태를 관리
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴가 열려 있는지 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 표시 여부 관리

  // 메뉴 열기/닫기 토글 함수
  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // menuOpen 상태를 반전시켜 메뉴 열림/닫힘을 제어
  };

  // 로그인/로그아웃 버튼 클릭 시 호출되는 함수
  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true); // 로그인 상태이면 로그아웃 모달을 표시
    } else {
      router.push('/login'); // 로그인이 안 되어있으면 로그인 페이지로 이동
    }
  };

  // 로그아웃 확인 버튼 클릭 시 호출되는 함수
  const handleLogoutConfirm = () => {
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    setShowLogoutModal(false); // 로그아웃 모달을 숨김
    router.push('/'); // 홈 페이지로 이동
  };

  // 로그아웃 취소 버튼 클릭 시 호출되는 함수
  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // 로그아웃 모달을 숨김
  };

  // 마이 페이지 이동 함수
  const goToMypage = () => {
    if (isLoggedIn) router.push('/myPage'); // 로그인 상태면 마이페이지로 이동
    else router.push('/login'); // 아니면 로그인 페이지로 이동
  };

  // 공지사항 페이지 이동 함수
  const goToNotice = () => {
    if (isLoggedIn) router.push('/notification'); // 로그인 상태면 공지사항 페이지로 이동
    else router.push('/login'); // 아니면 로그인 페이지로 이동
  };

  // 자주 묻는 질문 페이지 이동 함수
  const goToQnA = () => {
    if (isLoggedIn) router.push('/qna'); // 로그인 상태면 QnA 페이지로 이동
    else router.push('/login'); // 아니면 로그인 페이지로 이동
  };

  return (
    <div>
      {/* 메뉴 버튼을 화면 오른쪽 상단에 배치 */}
      <div className="absolute top-4 right-4 z-20">
        <button
          id="menuToggle"
          className="text-3xl focus:outline-none"
          onClick={toggleMenu} // 메뉴 토글 버튼 클릭 시 toggleMenu 함수 호출
        >
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
            <div></div>
            <div></div>
            <div></div>
          </span>
        </button>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div id="mainContent" className="flex flex-col justify-center items-start h-screen p-6">
        <h1 className="text-4xl font-bold text-blue-300">MUMUL</h1>
        <h2 className="text-3xl font-bold mt-2">당신의 번거로움을 줄여주는 챗봇</h2>
        <p className="mt-4">
          AI 기술을 이용해 각종 이용객들의 질문을 더는 고민하지 않게 해드립니다.
        </p>
        <Link href="/login">
          <button className="mt-6 bg-red-400 text-white px-4 py-2 rounded">체험하러가기</button>
        </Link>
      </div>

      {/* 메뉴가 열려 있을 때 전체 화면 오버레이를 보여줌 */}
      {menuOpen && (
        <div
          id="fullscreenOverlay"
          className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-30"
        >
          {/* 메뉴 닫기 버튼 */}
          <button
            className="absolute top-4 right-4 text-3xl text-white focus:outline-none no-blur"
            onClick={toggleMenu} // 메뉴 닫기 버튼 클릭 시 toggleMenu 함수 호출
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          {/* 메뉴 아이템들 */}
          <p className="mt-2 cursor-pointer text-white" onClick={handleLoginLogoutClick}>Log in / Log out</p>
          <p className="mt-2 cursor-pointer text-white" onClick={goToMypage}>마이 페이지</p>
          <p className="mt-2 cursor-pointer text-white" onClick={goToNotice}>공지사항</p>
          <p className="mt-2 cursor-pointer text-white" onClick={goToQnA}>자주 묻는 질문</p>
        </div>
      )}

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">로그아웃하시겠습니까?</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleLogoutConfirm} // 로그아웃 확인 버튼 클릭 시 handleLogoutConfirm 함수 호출
            >
              로그아웃
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={handleLogoutCancel} // 로그아웃 취소 버튼 클릭 시 handleLogoutCancel 함수 호출
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

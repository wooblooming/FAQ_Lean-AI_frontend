import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트

const MainPageWithMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 표시 여부 관리

  const router = useRouter();

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true); // 로그인 상태이면 로그아웃 모달을 표시
    }
  };

  const handleLogoutConfirm = () => {
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    setShowLogoutModal(false); // 로그아웃 모달을 숨김
    router.push('/'); // 홈 페이지로 이동
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // 로그아웃 모달을 숨김
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <nav className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">LEAN AI</div>
        <div className="flex space-x-4">
          <Link href="/notification" className="text-xl flex items-center justify-center w-8 h-8">
            <i className="fas fa-bell"></i>
          </Link>
          <button
            id="menuToggle"
            className="text-xl flex items-center justify-center w-8 h-8 focus:outline-none"
            onClick={toggleMenu}
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
        </div>
      </nav>

      <main id="main-content" className="text-center">
        <h1 className="text-xl font-bold mb-4">
          사람이 답할 시간은 끝났습니다.
          <br />
          이제는 로봇이 응답합니다
        </h1>

        <div className="bg-gray-300 rounded-lg flex items-center justify-center mb-6 mx-auto" style={{ width: '100%', maxWidth: '500px' }}>
          <img src="banner_2.png" alt="상단 배너 이미지" className="w-full object-cover rounded-lg" />
        </div>

        <div className="mb-6 mt-8">
          <h2 className="text-xl font-bold">무물떡볶이님을</h2>
          <p className="text-lg">위한 서비스를 준비했어요.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/changeInfo" className="bg-gray-300 rounded-lg py-8 w-full text-center">
            업종 정보 변경
          </Link>
          <Link href="/editData" className="bg-gray-300 rounded-lg py-8 w-full text-center">
            FAQ 데이터 수정하기
          </Link>
        </div>
      </main>

      {/* 오버레이 메뉴 */}
      {menuOpen && (
        <div
          id="fullscreenOverlay"
          className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-20"
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
          <ul className="space-y-4 text-lg text-white text-center">
            <li><p className="mt-2 cursor-pointer text-white" onClick={handleLoginLogoutClick}>Log in / Log out</p></li>
            <li><Link href="/myPage">마이페이지</Link></li>
            <li><Link href="/notification">공지사항</Link></li>
            <li><Link href="/qna">자주 묻는 질문</Link></li>
          </ul>
        </div>
      )}

      {/* 로그아웃 모달 */}
      <ModalMSG 
        show={showLogoutModal} // 모달 표시 여부
        onClose={handleLogoutCancel} // 모달 닫기 함수
        title="Logout" // 모달 제목
      >
        <div className="flex flex-col items-center z-40">
          <p className="mb-4 text-center">로그아웃하시겠습니까?</p>
          <div className="flex space-x-4 mt-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
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
      </ModalMSG>

      <style jsx>{`
        .menu-icon {
          display: inline-block;
          position: relative;
          width: 30px;
          height: 24px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        .menu-icon div {
          background-color: black;
          height: 3px;
          width: 100%;
          margin: 4px 0;
          transition: all 0.3s ease-in-out;
        }

        .menu-icon.open div:nth-child(1) {
          transform: rotate(45deg);
          position: absolute;
          top: 10px;
        }

        .menu-icon.open div:nth-child(2) {
          opacity: 0;
        }

        .menu-icon.open div:nth-child(3) {
          transform: rotate(-45deg);
          position: absolute;
          top: 10px;
        }

        .fullscreen-overlay {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          z-index: 30;
        }

        .no-blur {
          backdrop-filter: none;
        }
      `}</style>
    </div>
  );
};

export default MainPageWithMenu;

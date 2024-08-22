import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트

const MainPageWithMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 표시 여부 관리
  const [isMobile, setIsMobile] = useState(false); // 모바일 화면 여부 관리
  const [storeName, setStoreName] = useState(''); // 스토어 이름을 저장할 상태 추가
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

  const router = useRouter();

  // 에러 메시지 모달 닫기
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage(''); // 에러 메시지 초기화
  };

  // 스토어 정보를 가져오는 함수
  const fetchStoreInfo = async () => {

    try {
      const token = localStorage.getItem('token'); // 저장된 JWT 토큰을 가져옴
      console.log('Token:', token);
      if (!token) {
        router.push('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/user-stores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      });
      
      if (response.status === 401) {
       // 토큰 만료 또는 인증 실패
        setErrorMessage('세션이 만료되었거나 인증에 실패했습니다. 다시 로그인해 주세요.');
        setShowErrorMessageModal(true);
        localStorage.removeItem('token'); // 만료된 토큰 삭제
        router.push('/login'); // 로그인 페이지로 리디렉션
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch store information: ${response.statusText}`);
      }

      const storeData = await response.json();
      if (storeData && storeData.length > 0) {
        setStoreName(storeData[0].store_name); // 첫 번째 스토어의 이름을 설정
      } else {
        setStoreName(' '); // 스토어가 없을 경우 처리
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('로딩 중에 에러가 발생 했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 화면 너비가 768px 이하이면 모바일로 간주
    };

    handleResize(); // 컴포넌트 마운트 시 초기화
    window.addEventListener('resize', handleResize); // 화면 크기 변경 시 이벤트 리스너 등록

    fetchStoreInfo(); // 컴포넌트가 마운트될 때 스토어 정보를 가져옴

    return () => window.removeEventListener('resize', handleResize); // 클린업
  }, []);

  useEffect(() => {
    if (showLogoutModal) {
      setMenuOpen(false); // 로그아웃 모달이 열리면 메뉴를 닫음
    }
  }, [showLogoutModal]);

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
    <div className="min-h-screen bg-gray-100 relative w-full flex flex-col ">
      <div id='main' className="flex-grow p-4">
        <nav className="flex justify-between items-center mb-6">
          <div className="text-lg font-bold p-4">LEAN AI</div>
          <div className="flex space-x-4">
            <Link href="/notification" className="text-xl flex items-center justify-center w-8 h-8">
              <i className="fas fa-bell"></i>
            </Link>
            <button
              id="menuToggle"
              className="text-xl flex items-center justify-center w-8 h-8 focus:outline-none"
              onClick={toggleMenu}
              style={{ marginRight: '10px' }}
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
            <h2 className="text-xl font-bold">{storeName}님을</h2>
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
      </div>

      {/* footer: 모바일에서는 표시하지 않음 */}
      {!isMobile && (
        <footer className='bg-black text-gray-400 text-xs font-sans p-4 w-full flex justify-start items-center mt-8'>
          <img src='Lean-AI logo.png' className='h-12 mr-4' />
          <p className='whitespace-pre-line'>
            {`LEAN AI
            (우)08789 서울 관악구 봉천로 545 2층 
            © LEAN AI All Rights Reserved.`}
          </p>
        </footer>
      )}

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
        title=" " // 모달 제목
      >
        <div className="flex flex-col items-center z-50 relative">
          <p className="mb-4 text-center">로그아웃하시겠습니까?</p>
          <div className="flex space-x-4 mt-2">
            <button
              className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-500"
              onClick={handleLogoutConfirm} // 로그아웃 확인 버튼 클릭 시 handleLogoutConfirm 함수 호출
            >
              로그아웃
            </button>
            <button
              className="bg-gray-300 text-white px-4 py-2 rounded rounded hover:bg-gray-400"
              onClick={handleLogoutCancel} // 로그아웃 취소 버튼 클릭 시 handleLogoutCancel 함수 호출
            >
              취소
            </button>
          </div>
        </div>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
        <p style={{ whiteSpace: 'pre-line' }}>
          {typeof errorMessage === 'object' ? (
            Object.entries(errorMessage).map(([key, value]) => (
              <span key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}<br />
              </span>
            ))
          ) : (
            errorMessage
          )}
        </p>
        <div className="flex justify-center mt-4">
          <button onClick={handleErrorMessageModalClose}
            className="text-white bg-blue-300 rounded-md px-4 py-2 font-normal border-l hover:bg-blue-500 "
          >
            확인
          </button>
        </div>
      </ModalErrorMSG>

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
          z-index: 20;
        }

        .no-blur {
          backdrop-filter: none;
        }

        /* 모바일에서 footer 숨기기 */
        @media (max-width: 768px) {
          footer {
            display: none;
          }
        }
      `}</style>

    </div>
  );
};

export default MainPageWithMenu;

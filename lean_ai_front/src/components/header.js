import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트
import config from '../../config'; // config 파일에서 API URL 등을 가져오기

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null); // QR 코드 이미지 URL 관리
  const [storeName, setStoreName] = useState(''); // 스토어 이름 관리
  const [message, setMessage] = useState(''); // 일반 메시지 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 관리
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열림/닫힘 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 열림/닫힘 상태 관리
  const [showQrModal, setShowQrModal] = useState(false); // QR 코드 모달 열림/닫힘 상태 관리
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 열림/닫힘 상태 관리
  const [showMessageModal, setShowMessageModal] = useState(false); // 일반 메시지 모달 열림/닫힘 상태 관리

  const qrCanvasRef = useRef(null); // QR 코드 이미지를 캔버스에 그리기 위한 참조 생성
  const router = useRouter();

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // QR 코드를 서버에서 가져오는 함수
  const fetchQRCode = async () => {
    try {
      const token = sessionStorage.getItem('token');
      //console.log('Token:', token); // 토큰 확인
      const response = await fetch(`${config.apiDomain}/api/qrCodeImage/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //console.log('Response Status:', response.status); // 응답 상태 확인

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const data = await response.json();
      console.log('QR Code Data:', data.qr_code_image_url); // 반환된 데이터 확인

      // 퍼센트 인코딩된 URL을 디코딩해서 한글을 포함한 파일 이름을 정상적으로 처리
      if (data.qr_code_image_url) {
        // QR 코드 이미지 URL이 있는 경우만 설정
        const mediaUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}${decodeURIComponent(data.qr_code_image_url)}`;
        setQrCodeImageUrl(mediaUrl);
        console.log('Media URL:', mediaUrl);
      } else {
        // QR 코드 이미지 URL이 없으면 null로 설정
        setQrCodeImageUrl(null);
      }
      
      setStoreName(data.store_name); // 스토어 이름 저장
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setErrorMessage('QR 코드 로딩 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  useEffect(() => {
    if (!qrCodeImageUrl) {
      fetchQRCode(); // QR 코드 URL이 없으면 QR 코드 가져오기 함수 실행
    }
  }, [qrCodeImageUrl]); // QR 코드 URL 상태 변경 감지

  // 로그인/로그아웃 클릭 시 동작 함수
  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setMenuOpen(false);
      setShowLogoutModal(true);
    } else {
      router.push('/login'); // 로그인 상태가 아니면 로그인 페이지로 이동
    }
  };

  // 로그아웃 확인 시 동작 함수
  const handleLogoutConfirm = () => {
    sessionStorage.removeItem('token'); // 로컬스토리지에서 토큰 제거
    setIsLoggedIn(false); // 로그인 상태 변경
    setShowLogoutModal(false); // 로그아웃 모달 닫기
    router.push('/'); // 홈으로 이동
  };

  // 로그아웃 취소 시 동작 함수
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // 메뉴 열림/닫힘 상태 토글
  };

  // 인덱스로 이동하는 함수
  const goToHome = () => {
    router.push('/');
  };

  // 마이페이지로 이동하는 함수
  const goToMypage = () => {
    if (isLoggedIn) router.push('/myPage');
    else router.push('/login'); // 로그인 상태에 따라 페이지 이동
  };

  // QR 코드 생성 모달을 여는 함수
  const goToQRCode = async () => {
    try {
      // console.log('Initial qrCodeImageUrl:', qrCodeImageUrl); // 최초 상태 확인
      if (!qrCodeImageUrl) {
        console.log('Fetching QR code...');
        await fetchQRCode(); // QR 코드가 없으면 가져오기
      }

      // console.log('Updated qrCodeImageUrl:', qrCodeImageUrl); // 상태 업데이트 후 확인

      if (!qrCodeImageUrl) {
        router.push('/myPage'); 
      } else {
        setShowQrModal(true); // QR 코드가 있으면 모달 열기
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setErrorMessage('QR 코드 로딩 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  // QR 코드 이미지를 저장하는 함수
  const handleSaveQRCode = () => {
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = qrCodeImageUrl; // QR 코드 이미지 URL 설정

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0); // QR 코드 이미지를 캔버스에 그리기
      const dataUrl = canvas.toDataURL('image/png'); // 이미지를 데이터 URL로 변환

      // 이미지 다운로드 링크 생성 및 클릭
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${storeName}_qr_code.png`; // 스토어 이름을 포함한 파일명 설정
      link.click(); // 다운로드 트리거
    };
  };

  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  return (
    <div>
      {/* 헤더 섹션 */}
      <header
        className="bg-white bg-opacity-90 fixed w-full z-10 transition-all duration-300"
        style={{
          boxShadow: scrollPosition > 50 ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* 로고 */}
          <div className="text-3xl md:text2xl font-bold text-indigo-600 pl-2 cursor-pointer" onClick={goToHome}>
            MUMUL
          </div>
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
        </div>
      </header>

      {/* 오버레이 메뉴 */}
      {menuOpen && (
        <div id="fullscreenOverlay" className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-20">
          <button className="absolute top-4 right-4 text-3xl text-black focus:outline-none no-blur" onClick={toggleMenu}>
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          <ul className="space-y-4 text-black text-center text-2xl font-semibold font-sans">
            <li>
              <p className="mt-2 cursor-pointer " onClick={handleLoginLogoutClick}>
                {isLoggedIn ? 'Log out' : 'Log in'}
              </p>
            </li>
            <li>
              <p className="mt-2 cursor-pointer " onClick={goToHome}>
                Home
              </p>
            </li>
            <li>
              <p className="mt-2 cursor-pointer " onClick={goToMypage}>
                마이 페이지
              </p>
            </li>
            <li>
              <p className="mt-2 cursor-pointer " onClick={goToQRCode}>
                QR코드 생성
              </p>
            </li>
          </ul>
        </div>
      )}

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative" style={{ width: '350px' }}>
            <button onClick={handleLogoutCancel} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10" aria-label="Close">
              &times;
            </button>
            <p className="mb-4 text-center">로그아웃하시겠습니까?</p>
            <div className="flex space-x-4 mt-2 items-center justify-center">
              <button className="bg-red-300 text-white px-4 py-2 rounded " onClick={handleLogoutConfirm}>
                로그아웃
              </button>
              <button className="bg-gray-300 text-white px-4 py-2 rounded " onClick={handleLogoutCancel}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR 코드 모달 */}
      {showQrModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
            <button onClick={() => setShowQrModal(false)} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600">
              X
            </button>
            <h2 className="text-xl font-bold mb-1.5">챗봇 전용 QR 코드</h2>
            <p className="text-gray-400" style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
              {`이용하려는 챗봇의 QR코드\n이미지를 저장할 수 있습니다`}
            </p>
            {qrCodeImageUrl && (
              <>
                <canvas ref={qrCanvasRef} style={{ display: 'none' }} />
                <img src={qrCodeImageUrl} alt="QR Code" className="mx-auto" /> 
              </>
            )}
            <p className="font-semibold underline hover:text-blue-400" onClick={handleSaveQRCode}>
              이미지 저장하기
            </p>
          </div>
        </div>
      )}

      <ModalMSG show={showMessageModal} onClose={handleMessageModalClose} title=" ">
        <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
      </ModalMSG>

      <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose} title="Error">
        <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
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
          background-color: rgb(79 70 229);
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
          background: rgba(238, 242, 255, 0.5);
          backdrop-filter: blur(10px);
          z-index: 20;
        }

        .no-blur {
          backdrop-filter: none;
        }
      `}</style>
    </div>
  );
};

export default Header;

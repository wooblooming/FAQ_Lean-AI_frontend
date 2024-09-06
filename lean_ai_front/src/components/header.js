import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트
import config from '../../config'; // config 파일에서 API URL 등을 가져오기

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null);
  const [storeName, setStoreName] = useState('');

  const qrCanvasRef = useRef(null);

  const router = useRouter();

  // QR 코드를 가져오는 함수
  const fetchQRCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiDomain}/api/qrCodeImage/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const data = await response.json();
      //console.log('QR Code Data:', data);
      setStoreName(data.store_name);
      setQrCodeImageUrl(data.qr_code_image_url);
      //console.log('QR code URL set:', data.qr_code_image_url);
    } catch (error) { 
      console.error('Error fetching QR code:', error);
      setErrorMessage('QR 코드 로딩 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  useEffect(() => {
    if (!qrCodeImageUrl) {
      fetchQRCode();
    }
  }, [qrCodeImageUrl]);

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setMenuOpen(false);
      setShowLogoutModal(true);
    } else {
      router.push('/login');
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    router.push('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goToMypage = () => {
    if (isLoggedIn) router.push('/myPage');
    else router.push('/login');
  };

  const goToQRCode = async () => {
    try {
      if (!qrCodeImageUrl) {
        await fetchQRCode();
      }

      if (qrCodeImageUrl) {
        setShowQrModal(true);
      } else {
        router.push('/myPage');
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setErrorMessage('QR 코드 로딩 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  const goToNotice = () => {
    if (isLoggedIn) router.push('/notification');
    else router.push('/login');
  };

  const goToQnA = () => {
    if (isLoggedIn) router.push('/qna');
    else router.push('/login');
  };

  const handleSaveQRCode = () => {
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = qrCodeImageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${storeName}_qr_code.png`; // storeName을 파일명에 포함
      link.click();
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
    <>
      <nav className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold p-4">LEAN AI</div>
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
            <li>
              <p className="mt-2 cursor-pointer text-white" onClick={handleLoginLogoutClick}>
                {isLoggedIn ? 'Log out' : 'Log in'}
              </p>
            </li>
            <p className="mt-2 cursor-pointer text-white" onClick={goToMypage}>마이 페이지</p>
            <p className="mt-2 cursor-pointer text-white" onClick={goToQRCode}>QR코드 생성하기</p>
            <p className="mt-2 cursor-pointer text-white" onClick={goToNotice}>공지사항</p>
            <p className="mt-2 cursor-pointer text-white" onClick={goToQnA}>자주 묻는 질문</p>
          </ul>
        </div>
      )}

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative"
            style={{ width: '350px' }}
          >
            <button
              onClick={handleLogoutCancel}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
              aria-label="Close"
            >
              &times;
            </button>
            <p className="mb-4 text-center">로그아웃하시겠습니까?</p>
            <div className="flex space-x-4 mt-2 items-center justify-center">
              <button
                className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-500"
                onClick={handleLogoutConfirm}
              >
                로그아웃
              </button>
              <button
                className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleLogoutCancel}
              >
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
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-1.5">챗봇 전용 QR 코드</h2>
            <p className='text-gray-400' style={{ whiteSpace: 'pre-line', textAlign: 'center'}}>
              {`이용하려는 챗봇의 QR코드
이미지를 저장할 수 있습니다`}
            </p>
            {qrCodeImageUrl && (
              <>
                <canvas ref={qrCanvasRef} style={{ display: 'none' }} />
                <img src={qrCodeImageUrl} alt="QR Code" className="mx-auto" />
              </>
            )}
            <p className='font-semibold underline hover:text-blue-400'
                onClick={handleSaveQRCode}
            >
              이미지 저장하기
            </p>
          </div>
        </div>
      )}

      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title=" "
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {message}
        </p>
      </ModalMSG>

      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={handleErrorMessageModalClose}
        title="Error"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {errorMessage}
        </p>
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
      `}</style>
    </>
  );
};

export default Header;

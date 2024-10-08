import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // 햄버거 메뉴와 닫기 아이콘 사용
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러 메시지 모달 컴포넌트
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
      if (data.qr_code_image_url) {
        const mediaUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}${decodeURIComponent(data.qr_code_image_url)}`;
        setQrCodeImageUrl(mediaUrl);
      } else {
        setQrCodeImageUrl(null);
      }

      setStoreName(data.store_name); // 스토어 이름 저장
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

  // QR 코드 생성 모달을 여는 함수
  const goToQRCode = async () => {
    try {
      if (!qrCodeImageUrl) {
        await fetchQRCode(); // QR 코드가 없으면 가져오기
      }

      if (qrCodeImageUrl) {
        setShowQrModal(true); // QR 코드가 있으면 모달 열기
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setErrorMessage('QR 코드 로딩 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  return (
    <div>
      {/* 헤더 섹션 */}
      <header
        className="bg-indigo-600 fixed w-full z-20 transition-all duration-300 px-4"
        style={{
          boxShadow: scrollPosition > 50 ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {/* 로고 */}
        <div className="container md:mx-auto px-6 md:px-0 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl md:text-4xl font-bold text-white cursor-pointer">
              MUMUL
            </Link>

            {/* 햄버거 메뉴 버튼 */}
            <button
              id="menuToggle"
              className="text-xl flex items-center justify-center focus:outline-none md:hidden z-50"
              onClick={toggleMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 50,
              }}
            >
              {menuOpen ? <X size={30} color="white" /> : <Menu size={30} color="white" />} {/* 햄버거 메뉴 아이콘 */}
            </button>
          </div>
        </div>
      </header>

      {/* X 버튼을 별도로 고정 */}
      {menuOpen && (
        <button
          onClick={toggleMenu}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 100, // X 버튼이 오버레이 위에 위치하도록 설정
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <X size={30} color="white" />
        </button>
      )}

      {/* 오버레이 메뉴 */}
      {menuOpen && (
        <div id="fullscreenOverlay" className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-20">
          <ul className="space-y-4 text-black text-center text-2xl font-semibold font-sans">
            <li>
              <p className="mt-2 cursor-pointer " onClick={handleLoginLogoutClick}>
                {isLoggedIn ? 'Log out' : 'Log in'}
              </p>
            </li>
            <li>
              <p className="mt-2 cursor-pointer " onClick={() => router.push('/')}>
                Home
              </p>
            </li>
            <li>
              <p className="mt-2 cursor-pointer " onClick={() => router.push('/myPage')}>
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
            <button onClick={handleLogoutCancel} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-60" aria-label="Close">
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
            <button onClick={() => setShowQrModal(false)} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 z-60">
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

      {/* 메시지 모달 */}
      <ModalMSG show={showMessageModal} onClose={() => setShowMessageModal(false)} title=" ">
        <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorMessageModal} onClose={() => setShowErrorMessageModal(false)} title="Error">
        <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
      </ModalErrorMSG>

      <style jsx>{`
        .fullscreen-overlay {
          background: rgba(238, 242, 255, 0.5);
          backdrop-filter: blur(10px);
          z-index: 20;
        }
      `}</style>
    </div>
  );
};

export default Header;

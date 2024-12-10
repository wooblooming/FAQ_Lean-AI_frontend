import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../contexts/authContext';
import { useStore } from '../../contexts/storeContext';
import { usePublic } from '../../contexts/publicContext';
import { Menu, X } from 'lucide-react';
import LogoutModal from '../modal/logout'; // 로그아웃 모달 컴포넌트 가져오기
import ModalErrorMSG from '../modal/modalErrorMSG'; // 에러 메시지 모달 컴포넌트
import config from '../../../config'; // config 파일에서 API URL 등을 가져오기

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null); // QR 코드 이미지 URL 관리
  const [storeName, setStoreName] = useState(''); // 스토어 이름 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 관리
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열림/닫힘 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 열림/닫힘 상태 관리
  const [isLoading, setIsLoading] = useState(false); // QR 코드 이미지 로딩 상태
  const [showQrModal, setShowQrModal] = useState(false); // QR 코드 모달 열림/닫힘 상태 관리
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 열림/닫힘 상태 관리

  const qrCanvasRef = useRef(null); // QR 코드 이미지를 캔버스에 그리기 위한 참조 생성
  const router = useRouter();
  const { token, removeToken } = useAuth();
  const { storeID, removeStoreID } = useStore();
  const { isPublicOn, resetPublicOn } = usePublic();

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // QR 코드를 서버에서 가져오는 함수
  const fetchQRCode = async () => {
    const url = isPublicOn
      ? `${config.apiDomain}/public/qrCodeImage/`
      : `${config.apiDomain}/api/qrCodeImage/`;

    try {
      setIsLoading(true); // 로딩 시작
      const response = await axios.post(
        url,
        { public_id: storeID }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.qr_code_image_url) {
        const mediaUrl = decodeURIComponent(response.data.qr_code_image_url);
        setQrCodeImageUrl(mediaUrl);
        setStoreName(response.data.store_name || '');
      } else {
        setQrCodeImageUrl(null);
        router.push('/myPage'); // QR 코드 URL이 없으면 /myPage로 리다이렉트
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setErrorMessage('QR 코드 로딩 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };


  // QR 코드 이미지를 저장하는 함수
  const handleSaveQRCode = () => {
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous"; // CORS 문제 방지
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
    setIsLoggedIn(false); // 로그인 상태 변경
    setShowLogoutModal(false); // 로그아웃 모달 닫기
    removeToken();
    removeStoreID();
    resetPublicOn();
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

  // QR 코드 모달을 여는 함수
  const goToQRCode = async () => {
    setShowQrModal(true);
    await fetchQRCode();
  };

  const goToMyPage = () => {
    if (isPublicOn)
      router.push('/myPagePublic');
    else
      router.push('/myPage');
  }

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
          <div className="flex items-center justify-between" style={{ fontFamily: 'NanumSquareBold' }}>
            <Link href="/" className="text-2xl md:text-4xl font-bold text-white cursor-pointer" style={{ fontFamily: 'NanumSquareExtraBold' }}>
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
          <X size={28} className="text-black " />
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
              <p className="mt-2 cursor-pointer " onClick={() => goToMyPage()}>
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
      <LogoutModal
        show={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* QR 코드 모달 */}
      {showQrModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 m-3 md:mx-0 rounded-lg text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-500 font-bold"
            >
              <X className="bg-indigo-500 rounded-full text-white p-1" />
            </button>
            <h2 className="text-xl font-bold mb-2">챗봇 전용 QR 코드</h2>
            {isLoading ? (
              <p>로딩 중입니다...</p>
            ) : (
              <div>
                <canvas ref={qrCanvasRef} style={{ display: 'none' }} />
                <img src={qrCodeImageUrl} alt="QR Code" className="mx-auto" />
                <p
                  className="font-semibold underline cursor-pointer mt-2"
                  onClick={handleSaveQRCode}
                >
                  이미지 저장하기
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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

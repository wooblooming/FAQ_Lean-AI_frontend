import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { useLoginType } from "@/contexts/loginTypeContext";
import { Menu, X } from "lucide-react";
import { fetchStoreDataAll } from "@/fetch/fetchStoreDataAll";
import StoreSwitcher from "@/components/component/ui/storeSwitcher";
import LogoutModal from "@/components/modal/logout";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const Header = ({ isLoggedIn, setIsLoggedIn, isMainPage }) => {
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);

  const qrCanvasRef = useRef(null);
  const router = useRouter();
  const { token, removeToken } = useAuth();
  const { storeID, removeStoreID } = useStore();
  const { loginType, resetLoginType } = useLoginType();

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (token && isMainPage)
      fetchStoreDataAll(
        token,
        setStoreList,
        setErrorMessage,
        setShowErrorMessageModal
      );
  }, [token, isMainPage]);

  const fetchQRCode = async () => {
    let url;
    if(loginType==='public')
      url = `${API_DOMAIN}/public/qrCodeImage/`;
    else if (loginType==='corp')
      url = `${API_DOMAIN}/corp/qrCodeImage/`;
    else
    url =  `${API_DOMAIN}/api/qrCodeImage/`;

    try {
      setIsLoading(true);
      const response = await axios.post(
        url,
        { store_id: storeID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.qr_code_image_url) {
        const mediaUrl = decodeURIComponent(response.data.qr_code_image_url);
        setQrCodeImageUrl(mediaUrl);
        setStoreName(response.data.store_name || "");
      } else {
        setQrCodeImageUrl(null);
        router.push("/myPage");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setErrorMessage("QR 코드 로딩 중 오류가 발생했습니다.");
      setShowErrorMessageModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQRCode = () => {
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = qrCodeImageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${storeName}_qr_code.png`;
      link.click();
    };
  };

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setMenuOpen(false);
      setShowLogoutModal(true);
    } else {
      router.push("/login");
    }
  };

  const handleLogoutConfirm = () => {
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    removeToken();
    removeStoreID();
    resetLoginType();
    router.push("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goToQRCode = async () => {
    setShowQrModal(true);
    await fetchQRCode();
  };

  const goToMyPage = () => {
    if (loginType === "public") {
      router.push("/myPagePublic");
    } else if (loginType === "corporation") {
      router.push("/myPageCorp");
    } else {
      router.push("/myPage");
    }
  };

  return (
    <div>
      {/* 헤더 섹션 */}
      <header
        className="bg-indigo-600 fixed w-full z-20 transition-all duration-300 px-4"
        style={{
          boxShadow: scrollPosition > 50 ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {/* 로고 */}
        <div className="container md:mx-auto px-6 md:px-0 py-5">
          <div
            className="flex items-center justify-between"
            style={{ fontFamily: "NanumSquareBold" }}
          >
            <Link
              href="/"
              className="text-2xl md:text-4xl font-bold text-white cursor-pointer"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              MUMUL
            </Link>

            {/* 햄버거 메뉴와 스토어 선택 버튼을 함께 배치 */}
            <div className="flex items-center space-x-2 md:space-x-10 ">
              {/* 메인 페이지 매장 전환 드롭 다운 */}
              {isMainPage && (
                <div className="mr-2">
                  <StoreSwitcher storeList={storeList} />
                </div>
              )}

              {/* 햄버거 메뉴 버튼 */}
              <button
                id="menuToggle"
                className="text-xl flex items-center justify-center focus:outline-none md:hidden z-50"
                onClick={toggleMenu}
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 50,
                }}
              >
                {menuOpen ? (
                  <X size={30} color="white" />
                ) : (
                  <Menu size={30} color="white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* X 버튼을 별도로 고정 */}
      {menuOpen && (
        <button
          onClick={toggleMenu}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 100,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X size={28} className="text-black " />
        </button>
      )}

      {/* 오버레이 메뉴 */}
      {menuOpen && (
        <div
          id="fullscreenOverlay"
          className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-20"
        >
          <ul className="space-y-4 text-black text-center text-2xl font-semibold font-sans">
            <li>
              <p
                className="mt-2 cursor-pointer "
                onClick={handleLoginLogoutClick}
              >
                {isLoggedIn ? "Log out" : "Log in"}
              </p>
            </li>
            <li>
              <p
                className="mt-2 cursor-pointer "
                onClick={() => router.push("/")}
              >
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
                <canvas ref={qrCanvasRef} style={{ display: "none" }} />
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
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
        title="Error"
      >
        <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
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

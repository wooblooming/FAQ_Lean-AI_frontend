import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { useLoginType } from "@/contexts/loginTypeContext";
import LogoutModal from "@/components/modal/logout";

const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 열림 상태
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // 하위 메뉴 열림 상태
  const [mobileSubMenuOpenIndex, setMobileSubMenuOpenIndex] = useState(null); // 모바일 하위 메뉴 열림 인덱스
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 상태
  const navRef = useRef(null);
  const router = useRouter();
  const { token, removeToken } = useAuth();
  const { removeStoreID } = useStore();
  const { resetLoginType } = useLoginType();


  // 네비게이션 항목 설정
  const navItems = [
    { title: "회사소개", link: "company" },
    { title: "서비스", link: "services" },
    { title: "구독", link: "/subscriptionPlansIntroduce" },
    {
      title: "고객지원",
      link: "support",
      subItems: [
        { title: "공지사항", link: "/notice" },
        { title: "FAQ", link: "/faq" },
      ],
    },
  ];

  // 모바일 메뉴가 열릴 때 스크롤 방지 설정
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isMobileMenuOpen]);

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSubMenuOpen(false);
  };

  // 데스크탑 서브 메뉴 토글
  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  // 모바일 서브 메뉴 토글 (특정 인덱스를 기준으로)
  const toggleMobileSubMenu = (index) => {
    setMobileSubMenuOpenIndex(mobileSubMenuOpenIndex === index ? null : index);
  };

  // 세션 스토리지에서 토큰 확인하여 로그인 상태 설정
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true); // 토큰이 존재하면 로그인 상태로 설정
    } else {
      setIsLoggedIn(false); // 토큰이 없으면 비로그인 상태로 설정
    }
  }, [token]);

  // 로그인/로그아웃 버튼 클릭 핸들러
  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true); // 로그아웃 모달 열기
    } else {
      router.push("/login"); // 로그인 페이지로 이동
    }
  };

  // 로그아웃 확정 시 실행되는 함수
  const handleLogoutConfirm = () => {
    setIsLoggedIn(false); // 로그인 상태 갱신
    setShowLogoutModal(false); // 로그아웃 모달 닫기
    removeToken();
    removeStoreID();
    resetLoginType();
    router.push("/"); // 홈으로 이동
  };

  // 로그아웃 취소 시 모달 닫기
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // 페이지 섹션으로 이동

  const handleSectionClick = (section) => {
    if (section === "/subscriptionPlansIntroduce") {
      router.push(section); // 구독 페이지는 즉시 이동
    } else {
      router.push(`/?section=${section}`); // 다른 섹션은 기존 방식 유지
    }
  };

  return (
    <div ref={navRef}>
      <header className="bg-indigo-600 fixed w-full z-30 transition-all duration-300 px-4">
        <div className="container md:mx-auto px-6 md:px-0 py-5">
          <div
            className="flex items-center justify-between"
            style={{ fontFamily: "NanumSquareBold" }}
          >
            {/* 로고 링크 */}
            <Link
              href="/"
              className="text-2xl md:text-4xl font-bold text-white cursor-pointer"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              MUMUL
            </Link>
            {/* 데스크탑 네비게이션 */}
            <nav className="hidden md:block">
              <ul className="flex justify-end space-x-8">
                {navItems.map((item, index) => (
                  <li key={index} className="relative group">
                    {item.subItems ? (
                      <div>
                        <span
                          className="text-white text-xl md:text-2xl whitespace-nowrap font-medium hover:underline cursor-pointer"
                          onClick={toggleSubMenu}
                        >
                          {item.title}
                        </span>
                        {isSubMenuOpen && (
                          <ul className="absolute left-0 mt-2 py-2 rounded bg-white shadow-lg">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex} className="px-3 py-2">
                                <Link
                                  href={subItem.link}
                                  className="hover:text-indigo-600 whitespace-nowrap"
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <button
                        className="text-white text-xl md:text-2xl font-medium hover:underline"
                        onClick={() => handleSectionClick(item.link)}
                      >
                        {item.title}
                      </button>
                    )}
                  </li>
                ))}
                {/* 로그인/로그아웃 버튼 */}
                <li>
                  <button
                    className="text-white text-xl md:text-2xl font-medium hover:underline"
                    onClick={handleLoginLogoutClick}
                  >
                    {isLoggedIn ? "Log out" : "Log in"}
                  </button>
                </li>
              </ul>
            </nav>
            {/* 모바일 메뉴 버튼 */}
            <button className="md:hidden text-white" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center">
          <ul className="space-y-4 text-lg text-black font-semibold">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.subItems ? (
                  <div>
                    <button
                      className="text-3xl flex items-center justify-between w-full"
                      onClick={() => toggleMobileSubMenu(index)}
                    >
                      {item.title}
                    </button>
                    {mobileSubMenuOpenIndex === index && (
                      <ul className="pl-4 mt-2 space-y-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.link}
                              className="text-xl"
                              onClick={toggleMobileMenu}
                            >
                              - {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    className="text-3xl"
                    onClick={() => {
                      toggleMobileMenu();
                      handleSectionClick(item.link);
                    }}
                  >
                    {item.title}
                  </button>
                )}
              </li>
            ))}
            {/* 로그인/로그아웃 버튼 */}
            <li>
              <button className="text-3xl" onClick={handleLoginLogoutClick}>
                {isLoggedIn ? "Log out" : "Log in"}
              </button>
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

      <style jsx>{`
        .fullscreen-overlay {
          background: rgba(238, 242, 255, 0.5); // 배경 블러 효과
          backdrop-filter: blur(10px);
          z-index: 20;
        }
      `}</style>
    </div>
  );
};

export default NavBar;

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react'; // ChevronDown 아이콘 추가
import LogoutModal from '../components/logout'; // 로그아웃 모달 컴포넌트

const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [mobileSubMenuOpenIndex, setMobileSubMenuOpenIndex] = useState(null); // 모바일에서 열려 있는 서브메뉴 상태
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navRef = useRef(null);
  const router = useRouter();

  const navItems = [
    { title: '회사 소개', link: 'company' },
    { title: '서비스', link: 'services' },
    {
      title: '고객 지원',
      link: 'support',
      subItems: [
        { title: '공지사항', link: '/notice' },
        { title: 'FAQ', link: '/faq' },
      ],
    },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSubMenuOpen(false);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const toggleMobileSubMenu = (index) => {
    setMobileSubMenuOpenIndex(mobileSubMenuOpenIndex === index ? null : index);
  };

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
    } else {
      router.push('/login');
    }
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleSectionClick = (section) => {
    router.push(`/?section=${section}`); // 섹션으로 이동
  };

  return (
    <div ref={navRef}>
      <header className="bg-indigo-600 fixed w-full z-20 transition-all duration-300 px-4">
        <div className="container md:mx-auto px-6 md:px-0 py-5">
          <div className="flex items-center justify-between" style={{ fontFamily: 'NanumSquareBold' }}>
            <Link href="/" className="text-2xl md:text-4xl font-bold text-white cursor-pointer" style={{ fontFamily: 'NanumSquareExtraBold' }}>
              MUMUL
            </Link>
            <nav className="hidden md:block">
              <ul className="flex justify-end space-x-8">
                {navItems.map((item, index) => (
                  <li key={index} className="relative group">
                    {item.subItems ? (
                      <>
                        <span
                          className="text-white text-xl md:text-2xl font-medium hover:underline cursor-pointer"
                          onClick={toggleSubMenu}
                        >
                          {item.title}
                        </span>
                        {isSubMenuOpen && (
                          <ul className="absolute left-0 mt-2 py-2 rounded bg-white shadow-lg">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex} className="px-4 py-2">
                                <Link href={subItem.link} className="hover:text-indigo-600">
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
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
                <li>
                  <button
                    className="text-white text-xl md:text-2xl font-medium hover:underline"
                    onClick={handleLoginLogoutClick}
                  >
                    {isLoggedIn ? 'Log out' : 'Log in'}
                  </button>
                </li>
              </ul>
            </nav>
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
                  <>
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
                            <Link href={subItem.link} className="text-xl " onClick={toggleMobileMenu}>
                              - {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
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
            <li>
              <button className="text-3xl" onClick={handleLoginLogoutClick}>
                {isLoggedIn ? 'Log out' : 'Log in'}
              </button>
            </li>
          </ul>
        </div>
      )}

      <LogoutModal
        show={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

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

export default NavBar;

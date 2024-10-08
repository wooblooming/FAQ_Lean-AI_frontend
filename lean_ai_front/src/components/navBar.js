import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NavBar = ({ scrollPosition }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // 고객 지원 서브 메뉴 열림 상태
  const navRef = useRef(null);

  const navItems = [
    { title: '회사 소개', link: '#company' },
    { title: '서비스', link: '#services' },
    { 
      title: '고객 지원', 
      link: '#support', 
      subItems: [ // 고객 지원의 서브 메뉴 정의
        { title: '공지사항', link: '/notice' },
        { title: 'FAQ', link: '/faq' }
      ]
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
    setIsSubMenuOpen(false); // 서브 메뉴 초기화
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div ref={navRef}>
      <header
        className="bg-indigo-600 fixed w-full z-20 transition-all duration-300 px-4"
        style={{
          boxShadow: scrollPosition > 50 ? '0 4px 6px rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <div className="container md:mx-auto px-6 md:px-0 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" 
              className="text-2xl md:text-4xl font-bold text-white cursor-pointer"
              style={{fontFamily:'NanumSquareExtraBold'}}
            >
              MUMUL
            </Link>
            <nav className="hidden md:block">
              <ul className="flex justify-end space-x-8">
                {navItems.map((item, index) => (
                  <li key={index} className="relative group">
                    {item.subItems ? (
                      <>
                        <span 
                          className="text-white text-xl md:text-2xl font-medium hover:underline hover:font-bold transition duration-300 block cursor-pointer"
                          onClick={toggleSubMenu} // 서브 메뉴 토글
                          style={{fontFamily:'NanumSquareBold'}}
                        >
                          {item.title}
                        </span>
                        {isSubMenuOpen && (
                          <ul className="absolute left-0 mt-2 py-2 rounded bg-white shadow-lg">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex} className="px-4 py-2 ">
                                <Link 
                                  href={subItem.link} 
                                  className="text-gray-600 text-md md:text-lg font-medium hover:text-indigo-600 hover:font-semibold whitespace-nowrap "
                                  style={{fontFamily:'NanumSquare'}}
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link 
                        href={item.link} 
                        className="text-white text-xl md:text-2xl font-medium hover:underline transition duration-300 block"
                        style={{fontFamily:'NanumSquareBold'}}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <button className="md:hidden z-50 text-white" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div id="fullscreenOverlay" className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-20">
          <button className="absolute top-4 right-4 text-3xl text-white focus:outline-none no-blur" onClick={toggleMobileMenu}>
            <span className={`menu-icon ${isMobileMenuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          <ul className="space-y-4 text-lg text-white text-center">
            {navItems.map((item, index) => (
              <li key={index} className="cursor-pointer">
                {item.subItems ? (
                  <>
                    <span
                      className="text-black text-3xl block"
                      style={{fontFamily:'NanumSquareBold'}}
                      onClick={toggleSubMenu}
                    >
                      {item.title}
                    </span>
                    {isSubMenuOpen && (
                      <ul className="mt-2 space-y-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex} className="text-black text-2xl px-4 py-2">
                            <Link 
                              href={subItem.link} 
                              className="block text-black"
                              onClick={toggleMobileMenu} // 모바일 메뉴 닫기
                              style={{fontFamily:'NanumSquareBold'}}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.link} 
                    className="text-black text-3xl"
                    onClick={toggleMobileMenu} // 모바일 메뉴 닫기
                    style={{fontFamily:'NanumSquareBold'}}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <style jsx>{`

        @media (min-width: 768px) {
          .menu-icon {
            display: none;
          }
        }

        .menu-icon {
          display: inline-block;
          position: relative;
          width: 34px;
          height: 24px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        .menu-icon div {
          background-color: white;
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

export default NavBar;

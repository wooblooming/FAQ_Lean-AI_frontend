import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NavBar = ({ scrollPosition }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const navRef = useRef(null);

  const navItems = [
    {
      title: 'Lean-AI',
      subItems: [
        { name: '회사 소개', link: '/company' },
        { name: '연혁', link: '/history' },
        { name: '뉴스룸', link: '/news' },
      ],
    },
    {
      title: 'Service',
      subItems: [
        { name: '무물 서비스 소개', link: '/service-intro' },
        { name: '소상공인 솔루션', link: '/small-business-solution' },
        { name: '무인 매장 솔루션', link: '/unmanned-store-solution' },
        { name: '공공기관 솔루션', link: '/public-institution-solution' },
      ],
    },
    {
      title: 'Use case',
      subItems: [
        { name: '고객 성공 사례', link: '/customer-success-stories' },
        { name: '고객 후기', link: '/customer-reviews' },
      ],
    },
    {
      title: 'Support',
      subItems: [
        { name: '공지사항', link: '/notice' },
        { name: 'FAQ', link: '/faq' },
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

  const handleMouseEnter = () => {
    setIsNavExpanded(true);
  };

  const handleMouseLeave = (event) => {
    // relatedTarget이 유효한 DOM 요소인지 확인
    if (!event.relatedTarget || !(event.relatedTarget instanceof Node)) {
      setIsNavExpanded(false);
      return;
    }

    if (navRef.current && !navRef.current.contains(event.relatedTarget)) {
      setIsNavExpanded(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveIndex(null);
  };

  
  const toggleSubItems = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubMenuMouseEnter = () => {
    setIsNavExpanded(true);
  };

  return (
    <div ref={navRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <header
        className="bg-white fixed w-full z-20 transition-all duration-300"
        style={{
          boxShadow: scrollPosition > 50 ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl md:text-2xl font-bold text-indigo-600 cursor-pointer">MUMUL</Link>
            <nav className="hidden md:block">
              <ul className="flex justify-end space-x-8">
                {navItems.map((item, index) => (
                  <li key={index} className="relative group">
                    <Link href="/" className="text-black text-lg hover:text-indigo-600 hover:font-bold transition duration-300 block py-2">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <button className="md:hidden z-50" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* 데스크톱 서브메뉴 */}
      <div
        className={`hidden md:block fixed w-full bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isNavExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{
          top: '68px',
          zIndex: 30,
        }}
        onMouseEnter={handleSubMenuMouseEnter}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-5">
            <div></div>
            {navItems.map((item, index) => (
              <div key={index} onMouseEnter={handleSubMenuMouseEnter}>
                <h3 className="text-lg font-semibold mb-4 text-indigo-500">{item.title}</h3>
                <ul className="space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link href={subItem.link || '/'} className="text-sm text-gray-700 hover:text-indigo-500 block group">
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                  <p className="text-black text-2xl font-semibold" onClick={() => toggleSubItems(index)}>
                    {item.title}
                  </p>
                  <div className={`sub-menu ${activeIndex === index ? 'open' : ''}`}>
                    {activeIndex === index && item.subItems && (
                      <ul className="mt-2 space-y-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link href={subItem.link} className="block text-black" onClick={toggleMobileMenu}>
                              - {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
    <style jsx>{`
        .menu-icon {
          display: inline-block;
          position: relative;
          width: 30px;
          height: 24px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        /* md 사이즈일 경우 .menu-icon hidden */
        @media (min-width: 768px) {
          .menu-icon {
            display: none;
          }
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
        }

        .no-blur {
          backdrop-filter: none;
        }

        .sub-menu {
          max-height: 0;
          opacity: 0;
          transform: translateY(-10px);
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease, transform 0.3s ease;
        }

        .sub-menu.open {
          max-height: 200px;
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default NavBar;


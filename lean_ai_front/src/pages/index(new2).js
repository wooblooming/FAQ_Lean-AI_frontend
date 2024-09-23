import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MessageSquare, TrendingUp, CreditCard, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    // relatedTarget이 null이 아닐 때만 확인
    if (navRef.current && event.relatedTarget) {
      // relatedTarget이 navRef.current의 자식이 아닐 때만 nav를 닫음
      if (!navRef.current.contains(event.relatedTarget)) {
        setIsNavExpanded(false);
      }
    } else {
      // relatedTarget이 null인 경우에도 nav를 닫음
      setIsNavExpanded(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = () => {
    setIsNavExpanded(true); // 서브 메뉴 클릭 시 nav 유지
  };

  const handleSubMenuMouseEnter = () => {
    setIsNavExpanded(true); // 서브 메뉴에 마우스가 들어가면 nav 유지
  };

  const navItems = [
    {
      title: '회사소개',
      subItems: [
        { name: '회사 소개', link: '/company' },
        { name: '연혁', link: '/history' },
        { name: '뉴스룸', link: '/news' },
      ],
    },
    {
      title: '서비스',
      subItems: [
        { name: '무물 서비스 소개', link: '/service-intro' },
        { name: '소상공인 솔루션', link: '/small-business-solution' },
        { name: '무인 매장 솔루션', link: '/unmanned-store-solution' },
        { name: '공공기관 솔루션', link: '/public-institution-solution' },
      ],
    },
    {
      title: '활용 사례',
      subItems: [
        { name: '고객 성공 사례', link: '/customer-success-stories' },
        { name: '고객 후기', link: '/customer-reviews' },
      ],
    },
    {
      title: '고객 지원',
      subItems: [
        { name: '공지사항', link: '/notice' },
        { name: 'FAQ', link: '/faq' },
      ],
    },
    {
      title: '채용',
      subItems: [
        { name: '채용 정보', link: '/job-info' },
        { name: '팀 소개', link: '/team-introduction' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div 
        ref={navRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <header 
          className="bg-white fixed w-full z-20 transition-all duration-300" 
          style={{
            boxShadow: scrollPosition > 50 ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-purple-600">MUMUL</Link>
              <nav className="hidden md:block">
                <ul className="flex justify-end space-x-8">
                  {navItems.map((item, index) => (
                    <li key={index} className="relative group">
                      <Link href="/" className="text-black hover:text-purple-600 transition duration-300 block py-2" onClick={handleNavItemClick}>
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
          className={`hidden md:block fixed w-full bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isNavExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            top: '68px',
            zIndex: 30,
          }}
          onMouseEnter={handleSubMenuMouseEnter}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-5 gap-8">
              {navItems.map((item, index) => (
                <div key={index} onMouseEnter={handleSubMenuMouseEnter}>
                  <h3 className="text-lg font-semibold mb-4 text-purple-600">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link href={typeof subItem === 'string' ? '/' : subItem.link || '/'} 
                              className="text-sm text-gray-700 hover:text-purple-600 block group">
                          <span className="relative">
                            {typeof subItem === 'string' ? subItem : subItem.name}
                            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`md:hidden fixed inset-0 bg-white z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-10">
            <Link href="/" className="text-2xl font-bold text-purple-600">MUMUL</Link>
            <button onClick={toggleMobileMenu}>
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {navItems.map((item, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2 text-purple-600">{item.title}</h3>
                <ul className="space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link href={typeof subItem === 'string' ? '/' : subItem.link || '/'} className="text-sm text-gray-700 hover:text-purple-600 block">
                        {typeof subItem === 'string' ? subItem : subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* 히어로 섹션: 메인 콘텐츠를 소개하는 영역 */}
      <section className="bg-purple-100 pt-40 pb-20 px-4 md:px-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:ml-8">
            <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-800">
              소상공인부터 더 넓은 분야까지, <br /> <span className="text-indigo-600">무물이 함께합니다</span>
            </h1>
            <p className="text-xl mb-8 text-gray-600">고객 응대, 매출 증대, 주문 결제부터 다양한 산업의 디지털 혁신까지.<br />AI로 더 많은 가능성을 열어보세요.</p>
            <Link href="/login" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block">
              지금 시작하기 <ChevronRight className="inline ml-2" />
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-80 h-80 bg-indigo-300 rounded-full absolute top-0 right-0 z-0 animate-pulse"></div>
            <Image 
              src="/images/무물_로고.png" 
              alt="무물 로고" 
              width={500} 
              height={500} 
              className="relative z-10 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* 특징 섹션: 주요 기능을 소개하는 영역 */}
      <section className="py-20 bg-white skew-y-3">
        <div className="container mx-auto px-4 -skew-y-3">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">비즈니스를 한 단계 끌어올리는 <span className="text-indigo-600">핵심 기능</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <MessageSquare size={48} className="text-indigo-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">스마트 응대</h3>
              <p className="text-gray-600">AI가 고객의 문의에 실시간으로 응답하여 고객 만족도를 높이고 업무 효율을 극대합니다.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <TrendingUp size={48} className="text-purple-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">매출 최적화</h3>
              <p className="text-gray-600">고객 데이터를 분석하여 개인화된 프로모션을 제안, 매출 증대에 직접적으로 기여합니다.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <CreditCard size={48} className="text-pink-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">주문 결제 시스템</h3>
              <p className="text-gray-600">AI 챗봇으로 간결하게 주문 결제 시스템을 지원합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA(Call-to-Action) 섹션: 사용자의 행동을 유도하는 영역 */}
      <section className="py-20 bg-indigo-600 -skew-y-3 mt-20">
        <div className="container mx-auto px-4 text-center skew-y-3">
          <h2 className="text-4xl font-bold mb-6 text-white">지금 AI와 함께 미래의 비즈니스를 시작하세요</h2>
          <p className="text-xl mb-10 text-indigo-100">무물의 가능성을 직접 체험해보세요</p>
          <Link href="/login" className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block">
            무료 체험 시작하기 <ChevronRight className="inline ml-2" />
          </Link>
        </div>
      </section>

      {/* 푸터 섹션: 페이지 하단의 추가 정보 및 링크 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">(주)린에이아이</h3>
              <p className="text-gray-400">소상공인부터 더 넓은 분야까지. AI로 혁신을 선도합니다.</p>
              <p className="text-gray-400">서울특별시 관악구 봉천로 545, 2층(서울창업센터 관악) </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
              <ul className="space-y-2">
                <li><Link href="/service-intro" className="text-gray-400 hover:text-white transition duration-300">서비스 소개</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition duration-300">요금제</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition duration-300">이용 약관</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">문의하기</h4>
              <p className="text-gray-400">ch@lean-ai.com</p>
              <p className="text-gray-400">02-6951-1510</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 (주)린에이아이. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
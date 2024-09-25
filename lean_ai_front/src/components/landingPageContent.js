import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight, MessageSquare, TrendingUp, CreditCard, Zap, Shield, Rocket, Award, Users, Building } from 'lucide-react';

import Nav from '../components/navBar';
import Footer from '../components/footer';

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const router = useRouter();
  const sectionsRef = useRef([]); 
  const [firstAnimationTriggered, setFirstAnimationTriggered] = useState([false, false]); // 섹션 애니메이션 상태 관리

  // 페이지 렌더링 시 sessionStorage에서 토큰 확인하여 로그인 상태 설정
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // 스크롤 이벤트 추적
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer 적용
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (index === 1 || index === 3) { // MUMUL 서비스 소개와 성과 부분은 제외
          if (entry.isIntersecting && !firstAnimationTriggered[index]) {
            entry.target.classList.add('animate-show');
            setFirstAnimationTriggered((prev) => {
              const newState = [...prev];
              newState[index] = true; // 애니메이션이 실행된 상태로 업데이트
              return newState;
            });
          }
        } else {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-show');
          } else {
            entry.target.classList.remove('animate-show');
          }
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section && section instanceof Element) {
          observer.unobserve(section);
        }
      });
    };
  }, [firstAnimationTriggered]);

  // 각 섹션에 ref 연결
  const setSectionRef = (el, index) => {
    sectionsRef.current[index] = el;
  };

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/mainPageForPresident');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className='w-full min-h-screen'>
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
        <Nav scrollPosition={scrollPosition} />

        {/* 히어로 섹션 */}
        <section className="pt-36 pb-12 lg:pb-0 w-full px-4 md:px-8 mx-auto overflow-hidden section" ref={(el) => setSectionRef(el, 0)}>
          <div className="container mx-auto flex flex-col md:flex-row w-full max-w-none">
            <div className="md:w-1/2 mb-10 md:mb-0 md:ml-6 w-full">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-800 text-left whitespace-nowrap">
                비즈니스의 <br />
                <span className="text-indigo-600">디지털 파트너</span><br />
                무물이 함께합니다
              </h1>
              <div>
                <div className="hidden md:block md:text-xl text-gray-600 text-left whitespace-nowrap">
                  AI로 비즈니스의 혁신을 이뤄내세요. <br />
                  소상공인부터 공공기관까지, 맞춤형 AI 솔루션으로 <br />
                  고객 경험 향상, 업무 효율화, 매출 증대를 한 번에 실현합니다.
                </div>

                <div className="block md:hidden text-gray-600 text-left whitespace-pre-line" style={{ fontSize: '17px' }}>
                  AI로 비즈니스의 혁신을 이뤄내세요. <br />
                  소상공인부터 공공기관까지, 맞춤형 AI 솔루션으로 고객 경험 향상, 업무 효율화, 매출 증대를 한 번에 실현합니다.
                </div>
              </div>

              <button
                className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg mt-12 hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mx-auto md:mx-0"
                onClick={handleClick}
              >
                {isLoggedIn ? "메인 페이지로 이동" : "지금 시작하기"} <ChevronRight className="inline ml-2" />
              </button>
            </div>

            <div className="md:w-1/2 relative hidden lg:block">
              <div className=''>
                <div className='z-5 animate-pulse'>
                  <div className="w-40 h-40 md:w-80 md:h-80 bg-indigo-300 rounded-full absolute top-0 right-12 md:top-0 md:right-28"></div>
                  <div className="w-20 h-20 md:w-40 md:h-40 bg-violet-300 rounded-full absolute top-28 right-8 md:top-52 md:right-8"></div>
                </div>
                <img src="/챗봇.png" alt="BiZBot 대시보드 이미지" className="relative z-5 w-5/6 object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* MUMUL 서비스 소개 */}
        <section className="py-20 bg-white -skew-y-12 section" ref={(el) => setSectionRef(el, 1)}>
          <div className="container mx-auto px-4 relative flex flex-col items-center justify-center">
            <div className=" w-full bg-white p-12 rounded-lg">
              <div className="flex items-center justify-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">MUMUL <span className="text-indigo-600">서비스 소개</span></h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                  <Zap className="text-indigo-600 w-12 h-12 mb-6" />
                  <h2 className="text-2xl font-semibold mb-4">AI 기반 자동화</h2>
                  <p className="text-gray-600">최첨단 AI 기술을 활용하여 비즈니스 프로세스를 자동화하고 효율성을 극대화합니다.</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                  <Shield className="text-indigo-600 w-12 h-12 mb-6" />
                  <h2 className="text-2xl font-semibold mb-4">데이터 보안</h2>
                  <p className="text-gray-600">고객 데이터를 철저히 보호하며, 최고 수준의 보안 프로토콜을 적용합니다.</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                  <Rocket className="text-indigo-600 w-12 h-12 mb-6" />
                  <h2 className="text-2xl font-semibold mb-4">비즈니스 성장</h2>
                  <p className="text-gray-600">데이터 기반 인사이트를 제공하여 비즈니스의 지속적인 성장을 지원합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="py-20 section" ref={(el) => setSectionRef(el, 2)}>
          <div className="container mx-auto px-4 ">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800 whitespace-nowrap">
              비즈니스를 한 단계 끌어올리는 <span className="text-indigo-600 text-3xl md:text-4xl">핵심 기능</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <MessageSquare size={48} className="text-indigo-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">스마트 응대</h3>
                <p className="text-gray-600">AI가 고객의 문의에 실시간으로 응답하여 고객 만족도를 높이고 업무 효율을 극대화합니다.</p>
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

        {/* MUMUL의 성과와 협력 */}
        <section className="py-20 bg-white skew-y-3 mt-4 section" ref={(el) => setSectionRef(el, 3)}>
          <div className="bg-white p-12 rounded-xl ">
            <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">MUMUL의 성과와 협력</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-violet-50 p-4 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <Award className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-4">수상 실적</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>2020 4IR Awards AI부문 대상</li>
                  <li>제 3회 서울혁신챌린지 최우수상 (1등)</li>
                  <li>2019 산업지능화 스타트업 창업경진대회 우수상 (2등)</li>
                  <li>2018 고려대 SW중심대학 창업경진대회 최우수상</li>
                </ul>
              </div>
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-4">협력 관계</h3>
                <p className="text-gray-600 mb-4">
                  마이크로소프트, SK, 고려대, 기업은행 등 협업/지원관계를 구축하였습니다. <br />
                  과학정보통신부 ‘AI바우처 지원사업’ 공급기업 <br />
                  한국데이터산업진흥원  ‘데이터바우처 지원사업’ 공급기업 <br />
                  기술벤처기업 인증 (기술보증기금) <br />
                  기업부설연구소 설립
                </p>
              </div>
              <div className="text-center">
                <Building className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-4">사업 구축</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>데이터바우처 지원사업 32개사 솔루션 개발</li>
                  <li>AI바우처지원사업 25개사 솔루션 개발</li>
                  <li>전국 600여개 소상공인(학원) 대상 솔루션 개발</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-20  mt-4 section" ref={(el) => setSectionRef(el, 4)}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">MUMUL과 함께 성장하세요</h2>
            <p className="text-xl mb-8 text-gray-600"> 디지털 혁신을 위한 최고의 파트너, MUMUL이 함께합니다.</p>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300">
              지금 시작하기
            </button>
          </div>
        </section>

        <Footer />

        <style jsx>{`
          .section {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.6s ease-in-out;
          }

          .animate-show {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </div>
    </div>
  );
};

export default LandingPage;

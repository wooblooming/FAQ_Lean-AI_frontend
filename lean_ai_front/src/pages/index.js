import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRight, MessageSquare, TrendingUp, CreditCard } from 'lucide-react';
import Nav from '../components/navBar';
import Chating from '../components/chatbot_index';
import Footer from '../components/footer';

// LandingPage 컴포넌트: 웹사이트의 메인 랜딩 페이지를 구성합니다.
const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);  // 스크롤 위치 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 관리
  const router = useRouter();

  // 페이지가 렌더링될 때 sessionStorage에서 토큰을 확인하여 로그인 상태를 설정
  useEffect(() => {
    const token = sessionStorage.getItem('token');  // sessionStorage에서 'token' 값 가져옴
    if (token) {
      setIsLoggedIn(true);  // 토큰이 있으면 로그인 상태로 설정
    } else {
      setIsLoggedIn(false);  // 토큰이 없으면 로그아웃 상태로 설정
    }
  }, []);

  // 스크롤 이벤트를 통해 스크롤 위치를 추적하는 로직
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 버튼 클릭 시 로그인 상태에 따라 메인 페이지 또는 로그인 페이지로 리다이렉트
  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/mainPageForPresident');  // 로그인 상태일 경우 메인 페이지로 이동
    } else {
      router.push('/login');  // 로그아웃 상태일 경우 로그인 페이지로 이동
    }
  };

  return (
    // 전체 페이지 컨테이너
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 ">
      {/* 헤더 - navBar 컴퍼넌트 사용 */}
      <Nav scrollPosition={scrollPosition} />

      {/* 히어로 섹션 */}
      <section className="pt-32 pb-20 px-4 md:px-0 w-full">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* 왼쪽 텍스트 영역 */}
          <div className="md:w-1/2 mb-10 md:mb-0 md:ml-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-800 ">
              비즈니스의 <br />
              <span className="text-indigo-600">디지털 파트너</span><br />
              무물이 함께합니다
            </h1>
            <div className="text-lg md:text-xl mb-8 text-gray-600">
              AI로 당신의 비즈니스에 새로운 가치를 창출하세요. <br/> 
              소상공인부터 공공기관까지, 모든 비즈니스를 위한 맞춤형 솔루션으로 
              <p className='whitespace-nowrap'>고객 경험을 향상시키고, 운영을 효율화하며 매출을 증대시킬 수 있습니다. </p>
            </div>
            
            <button
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={handleClick}
            >
              {isLoggedIn ? "메인 페이지로 이동" : "지금 시작하기"} <ChevronRight className="inline ml-2" />
            </button>
          </div>

          {/* 오른쪽 이미지 영역*/}
          <div className="md:w-1/2 relative hidden md:block">
            <div className=''>
              {/* 배경 원형 요소 */}
              <div className='z-5 animate-pulse'>
                <div className="w-40 h-40 md:w-80 md:h-80 bg-indigo-300 rounded-full absolute top-0 right-12 md:top-0 md:ight-28"></div>
                <div className="w-20 h-20 md:w-40 md:h-40 bg-violet-300 rounded-full absolute top-28 right-8 md:top-52 md:right-8"></div>
              </div>
              {/* 메인 이미지 */}
              <img src="/챗봇.png" alt="BiZBot 대시보드 이미지" className="relative z-5 w-5/6 object-cover" />
            </div>
          </div> 
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20 bg-white skew-y-3">
        <div className="container mx-auto px-4 -skew-y-3">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800 spacewhite-nowrap">비즈니스를 한 단계 끌어올리는 <span className="text-indigo-600 text-3xl md:text-4xl">핵심 기능</span></h2>
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

      {/* 푸터 섹션 */}
      <Footer />
    </div>
  );
};

export default LandingPage;

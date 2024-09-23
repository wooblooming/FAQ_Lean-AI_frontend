import React, { useState, useEffect } from 'react';
import Nav from '../components/navBar';
import Footer from '../components/footer';
import { ChevronRight, MessageSquare, TrendingUp, CreditCard} from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Nav scrollPosition={scrollPosition} />

      {/* 히어로 섹션 */}
      <section className="bg-purple-100 pt-40 md:px-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:ml-8">
            <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-800 whitespace-nowrap">
              소상공인부터 더 넓은 분야까지, <br /> <span className="text-indigo-600">무물이 함께합니다</span>
            </h1>
            <p className="text-xl mb-8 text-gray-600">고객 응대, 매출 증대, 주문 결제부터 다양한 산업의 디지털 혁신까지.<br />AI로 더 많은 가능성을 열어보세요.</p>
            <Link href="/login" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block">
              지금 시작하기 <ChevronRight className="inline ml-2" />
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <div className=''>
              {/* 배경 원형 요소 */}
              <div className='z-5 animate-pulse'>
                <div className="w-40 h-40 md:w-80 md:h-80 bg-indigo-300 rounded-full absolute top-0 right-28"></div>
                <div className="w-20 h-20 md:w-40 md:h-40 bg-violet-300 rounded-full absolute top-52 right-8"></div>
              </div>
              {/* 메인 이미지 */}
              <img src="/챗봇.png" alt="BiZBot 대시보드 이미지" className="relative z-5 w-5/6 object-cover" />
            </div>
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

      {/* CTA(Call-to-Action) 섹션: 사용자의 행동을 유도하는 영역 */}
      <section className="py-20 bg-indigo-600 -skew-y-3 mt-20">
        <div className="container mx-auto px-4 text-center skew-y-3">
          <h2 className="text-4xl font-bold mb-6 text-white">지금 AI와 함께 미래의 비즈니스를 시작하세요</h2>
          <p className="text-xl mb-10 text-indigo-100">무물의 가능성을 직접 체험해보세요</p>
          <Link href="/" className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block">
            무료 체험 시작하기 <ChevronRight className="inline ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

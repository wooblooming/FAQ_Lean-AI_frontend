import React from 'react';
import { Zap, Shield, Rocket, ArrowLeft, Award, Users, Building } from 'lucide-react'; // Award, Users, Building 추가
import Link from 'next/link';


const ServiceIntroPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center text-center mb-12">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mr-4">
            <ArrowLeft className="mr-2 text-4xl" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">MUMUL <span className="text-indigo-600">서비스 소개</span></h1>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Zap className="text-indigo-600 w-12 h-12 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">AI 기반 자동화</h2>
            <p className="text-gray-600">최첨단 AI 기술을 활용하여 비즈니스 프로세스를 자동화하고 효율성을 극대화합니다.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Shield className="text-indigo-600 w-12 h-12 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">데이터 보안</h2>
            <p className="text-gray-600">고객 데이터를 철저히 보호하며, 최고 수준의 보안 프로토콜을 적용합니다.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Rocket className="text-indigo-600 w-12 h-12 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">비즈니스 성장</h2>
            <p className="text-gray-600">데이터 기반 인사이트를 제공하여 비즈니스의 지속적인 성장을 지원합니다.</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-xl shadow-lg mb-20">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">무물이 제공하는 가치</h2>
          <ul className="list-disc pl-6 space-y-4 text-gray-600">
            <li>고객 응대로 고객 만족도 향상</li>
            <li>데이터 분석을 통한 맞춤형 마케팅 전략 수립</li>
            <li>업무 자동화로 인한 비용 절감 및 생산성 향상</li>
            <li>실시간 비즈니스 인사이트 제공으로 신속한 의사결정 지원</li>
            <li>손쉬운 통합으로 기존 비즈니스 프로세스와의 원활한 연동</li>
          </ul>
        </div>

       {/* 새로운 섹션: 회사 성과 */}
       <div className="bg-white p-12 rounded-xl shadow-lg mb-20">
          <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">MUMUL의 성과와 협력</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
                마이크로소프트, SK, 고려대, 기업은행 등 협업/지원관계를 구축하였습니다. <br/>
                과학정보통신부 ‘AI바우처 지원사업’ 공급기업 <br/>
                한국데이터산업진흥원  ‘데이터바우처 지원사업’ 공급기업 <br/>
                기술벤처기업 인증 (기술보증기금) <br/>
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
    
        
        {/* CTA 섹션 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">MUMUL과 함께 성장하세요</h2>
          <p className="text-xl mb-8 text-gray-600">소상공인의 디지털 혁신을 위한 최고의 파트너, MUMUL이 함께합니다.</p>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300">
            지금 시작하기
          </button>



        {/* 협력사 로고 슬라이드 섹션 */}
        <div className="overflow-hidden absolute bottom:0 w-full mt-5 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex space-x-12 h-12 w-full slide-animation">
            <img src="/uni1.png" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni2.png" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni3.png" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni4.png" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni5.png" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni6.png" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni7.jpg" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni8.png" alt="Korea Logo" className="w-auto h-auto" />
            <img src="/uni9.png" alt="Korea Logo" className="w-auto h-auto" />
          </div>
        </div>




        </div>
      </div>
    </div>
  );
};

export default ServiceIntroPage;
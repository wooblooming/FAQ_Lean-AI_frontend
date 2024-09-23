import React, { useState } from 'react'; // React와 useState 훅을 가져옵니다.
import { Check, ArrowLeft, Star } from 'lucide-react'; // 필요한 아이콘들을 lucide-react에서 가져옵니다.
import Link from 'next/link'; // Next.js의 Link 컴포넌트를 가져옵니다.

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null); // 선택된 요금제를 관리하는 상태를 생성합니다.

  const plans = [
    // 요금제 정보를 담은 배열입니다. 각 요금제는 이름, 가격, 기능 목록, 추천 여부를 포함합니다.
    {
      name: "스타터",
      price: "49,000",
      features: [
        "AI 챗봇 기본 기능",
        "월 1,000건 고객 응대",
        "기본 데이터 분석",
        "이메일 지원",
      ],
      recommended: false
    },
    {
      name: "프로",
      price: "99,000",
      features: [
        "AI 챗봇 고급 기능",
        "무제한 고객 응대",
        "고급 데이터 분석 및 리포트",
        "우선 이메일 및 전화 지원",
        "맞춤형 프로모션 추천"
      ],
      recommended: true
    },
    {
      name: "엔터프라이즈",
      price: "문의",
      features: [
        "모든 프로 기능 포함",
        "전용 계정 관리자",
        "맞춤형 AI 모델 개발",
        "온프레미스 설치 옵션",
        "24/7 프리미엄 지원"
      ],
      recommended: false
    }
  ];

  const handlePlanClick = (index) => {
    // 요금제를 클릭했을 때 실행되는 함수입니다. 선택된 요금제의 인덱스를 상태로 설정합니다.
    setSelectedPlan(index);
  };

  const handleInquiry = () => {
    // '문의하기' 버튼을 클릭했을 때 실행되는 함수입니다. 이메일 클라이언트를 열어 문의 메일을 작성할 수 있게 합니다.
    window.location.href = "mailto:ch@lean-ai.com?subject=Mumul 문의하기";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
      {/* 전체 페이지를 감싸는 컨테이너입니다. 배경 그라데이션과 패딩을 적용합니다. */}
      <div className="container mx-auto px-4">
        {/* 내용을 중앙에 정렬하고 좌우 패딩을 적용합니다. */}
        <div className="flex items-center justify-center text-center mb-12">
          {/* 페이지 상단의 뒤로 가기 버튼과 제목을 포함하는 영역입니다. */}
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mr-4">
            <ArrowLeft className="mr-2 text-5xl" />
          </Link>
          <h1 className="text-4xl font-bold text-center text-gray-800">합리적인 <span className="text-indigo-600">가격 정책</span></h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* 요금제 카드들을 그리드 레이아웃으로 배치합니다. 모바일에서는 1열, 태블릿 이상에서는 3열로 표시됩니다. */}
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer ${selectedPlan === index ? 'border-4 border-indigo-500 transform scale-105' : ''}`}
              onClick={() => handlePlanClick(index)}
            >
              {/* 각 요금제 카드입니다. 선택 시 테두리와 크기가 변경됩니다. */}
              <div className={`absolute top-0 right-0 bg-yellow-400 text-white p-2 rounded-bl-lg rounded-tr-xl ${selectedPlan === index ? '' : 'hidden'}`}>
                {/* 선택된 요금제에만 표시되는 별 아이콘입니다. */}
                <Star className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{plan.name}</h2>
              <div className="text-4xl font-bold mb-6 text-indigo-600">
                ₩{plan.price}<span className="text-base font-normal text-gray-600">/월</span>
              </div>
              <ul className="mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center mb-3">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-semibold transition duration-300 ${selectedPlan === index ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                {plan.price === "문의" ? "상담 요청하기" : "선택하기"}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-xl shadow-lg text-center">
          {/* 페이지 하단의 문의하기 섹션입니다. */}
          <h2 className="text-3xl font-bold mb-6 text-gray-800">궁금한 점이 있으신가요?</h2>
          <p className="text-xl mb-8 text-gray-600">우리 팀이 귀하의 비즈니스에 가장 적합한 솔루션을 찾아드리겠습니다.</p>
          <button 
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={handleInquiry}
          >
            문의하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
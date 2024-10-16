import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  Utensils, Monitor, ShoppingCart, Landmark, ChevronLeft, ChevronRight,
  UserPlus, PencilLine, Store, QrCode, Bot, FileCode2, HelpCircle, Brain, FileText, AppWindow
} from 'lucide-react';

// Guide Data (업주/고객 가이드라인 데이터)**: 각각의 단계를 저장하고 있는 배열
const ownerSteps = [
  { icon: UserPlus, title: "간단한 가입, 직관적 UI", description: "30초만에 가능한 가입 절차, 누구나 쉽게 접근 가능한 UI로 구성되어있습니다.", image: "/owner1.png" },
  { icon: PencilLine, title: "손쉬운 FAQ 데이터 수정", description: "엑셀, 한글파일로 제공되는 양식에 정보 입력하여 업로드, 초기 데이터는 영업일 기준 3일 내, 수정 데이터는 영업일 기준 1일 내 반영됩니다.", image: "/owner2.png" },
  { icon: Store, title: "실시간 매장 기본정보 수정", description: "배너 사진, 영업 정보, 메뉴 수정 등 간단한 매장 기본정보는 실시간으로 반영됩니다.", image: "/owner3.png" },
];

const customerSteps = [
  { icon: QrCode, title: "QR코드 스캔", description: "업장마다 고유의 QR코드를 제공, 테이블, 벽 의자 어디에든 설치 가능합니다", image: "/customer1.png" },
  { icon: AppWindow, title: "매장 정보 확인", description: "노출하시고자 하는 정보를 고객들이 확인할 수 있습니다.", image: "/customer2.png" },
  { icon: Bot, title: "AI 챗봇 '무물봇'", description: "사전 학습된 정보를 바탕으로 업장에 필요한 모든 정보를 제공합니다.", image: "/customer3.png" },
];

// Features Data (서비스 소개 섹션 데이터)**
const features = [
  { icon: FileCode2, text: "고객 문의에 적합한 키워드 추천", description: "고객 문의의 맥락을 분석하여 최적의 키워드와 답변을 추천해줌으로써, 더욱 정확하고 신속한 응대를 가능하게 합니다." },
  { icon: HelpCircle, text: "자주 묻는 질문 답변 매칭", description: "사전에 등록된 자주 묻는 질문(FAQ)과의 매칭을 통해 반복적인 문의에 대해 자동으로 답변을 제공합니다." },
  { icon: Brain, text: "사전 학습 기반 답변 생성", description: "AI 챗봇이 사전 학습된 데이터를 바탕으로 고객의 다양한 문의에 대해 정확한 답변을 생성하고 제공합니다." },
  { icon: FileText, text: "고객 문의 데이터 인사이팅", description: "고객 문의 데이터를 분석하여 문의 유형, 빈도 등의 정보를 도출하고, 고객 응대의 개선 방향을 제시합니다." },
];

// GoodThings Data (장점 섹션 데이터)**
const goodThings = [
  { image: "/cost_saving.png", text: "인건 비용 절감", description: "반복적인 문의 응대 및 처리 작업을 자동화하여, 인력 운영에 따른 비용을 절감하고 보다 중요한 업무에 집중할 수 있도록 돕습니다." },
  { image: "/comunications.png", text: "직원-고객 간 감정소비 감소", description: "AI 챗봇을 통해 고객의 불만이나 문의를 처리하여, 직원들이 겪는 감정적 소모를 줄이고 보다 건강한 근무 환경을 조성합니다." },
  { image: "/efficiency.png", text: "업무 효율성 증대", description: "고객의 문의를 신속하게 해결하고 업무 프로세스를 최적화하여, 업무 효율성과 고객 만족도를 동시에 높입니다." },
];

// usecase Data (활용 섹션 데이터)**
const usecase = [
  {
    name: "식당",
    icon: Utensils,
    description: "화장실은 어디 있어요? 이 메뉴 얼마나 매워요? 몇 명이서 먹을 수 있어요? 주차는 어디에 해요? 등 반복적인 질문에 대해 AI 챗봇이 대신 답변하여 요리, 매장 운영에 더 집중하실 수 있습니다.",
    exemple: "- 1인 운영 매장, 인력 감축 희망 매장 등"
  },
  {
    name: "무인매장",
    icon: Monitor,
    description: "키오스크 어떻게 써요? 이 물건 언제 들어와요? 물품 반납 어떻게 해요? 등 반복적인 질문들은 AI 챗봇을 통해 응대합니다. 매장 내 연락처로 몰려오는 전화 문의를 줄여 본업에 집중하거나 야간 시간을 활용하실 수 있습니다.",
    exemple: "- 무인 스터디카페, 무인 숙박업소(에어비앤비), 무인 식료품점, 무인 스포츠업장 등"
  },
  {
    name: "소매점",
    icon: ShoppingCart,
    description: "이 물건 어디 있어요? 정사각형에 손바닥만 한 크기 접시 찾아주세요! 등의 반복적인 질문에 대해 AI 챗봇이 매장 물품 배치도와 함께 물품의 위치를 제공합니다.",
    exemple: "- 대형 편의점, 동네 마트, 철물점, 다이소 등"
  },
  {
    name: "공공기관",
    icon: Landmark,
    description: "소상공인 정부 지원금 신청 어디서 해요? 이번 달 수영 시간표 알려주세요! 등 민원인들의 반복적인 질문들을 AI 챗봇을 통해 응대합니다.",
    exemple: "- 복지센터, 체육센터, 행정센터 등"
  },
];

// FlipCard 컴포넌트**: 단계별 가이드라인을 카드 형태로 보여주고 클릭 시 회전하는 UI 컴포넌트
function FlipCard({ step, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="w-full h-80 cursor-pointer perspective"
      onClick={() => setIsFlipped(!isFlipped)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        {/* 카드 앞면 */}
        <div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <Image src={step.image} alt={`Step ${index + 1} illustration`} fill style={{ objectFit: "cover" }} className="rounded-lg" />
          <div className="absolute bottom-4 right-4 text-indigo-500">
            <p className="text-sm" style={{ fontFamily: "NanumSquareBold" }}>클릭하여 자세히 보기</p>
          </div>
        </div>

        {/* 카드 뒷면 */}
        <div className="absolute w-full h-full backface-hidden bg-indigo-200 rounded-lg shadow-lg p-6 flex flex-col justify-center" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="flex items-center mb-3">
            <div className="bg-indigo-50 rounded-full p-3 mr-2">
              {React.createElement(step.icon, { className: "w-5 h-5 text-indigo-600" })}
            </div>
            <h3 className="text-2xl text-gray-900 whitespace-pre-line" style={{ fontFamily: "NanumSquareExtraBold" }}>{step.title}</h3>
          </div>
          <p className="text-gray-700 text-lg" style={{ fontFamily: "NanumSquareBold" }}>{step.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ServiceSection 컴포넌트**: 전체 서비스 섹션을 구성하며, 모바일 및 데스크탑 뷰에 따라 각각의 UI를 다르게 렌더링
const ServiceSection = ({ isMobile }) => {
  // 상태값 정의
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOwnerStep, setIsOwnerStep] = useState(true); // 업주/고객 가이드라인 구분 상태
  const [goodThingIndex, setGoodThingIndex] = useState(0); // 장점 섹션 슬라이드 인덱스 관리
  const [featureIndex, setFeatureIndex] = useState(0); // Features 섹션 슬라이드 인덱스 관리

  // 단계별 데이터 설정 (업주/고객에 따라)
  const steps = isOwnerStep ? ownerSteps : customerSteps;

  // 가이드라인 이동 핸들러
  const handlePrev = () => setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  const handleNext = () => setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));

  // 장점 섹션 및 Feature 섹션 이동 핸들러
  const handleGoodThingPrev = () => setGoodThingIndex((prev) => (prev === 0 ? goodThings.length - 1 : prev - 1));
  const handleGoodThingNext = () => setGoodThingIndex((prev) => (prev === goodThings.length - 1 ? 0 : prev + 1));
  const handleFeaturePrev = () => setFeatureIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  const handleFeatureNext = () => setFeatureIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));

  // Swipeable 설정: 모바일 환경에서 슬라이드 가능하도록 설정
  const swipeHandlersForFeatures = useSwipeable({
    onSwipedLeft: () => handleFeatureNext(),
    onSwipedRight: () => handleFeaturePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const swipeHandlersForGoodThings = useSwipeable({
    onSwipedLeft: () => handleGoodThingNext(),
    onSwipedRight: () => handleGoodThingPrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // Features 섹션 렌더링 함수 (데스크탑)
  const renderFeatures = () => (
    <div className="w-full px-4">
      <p className="text-center font-semibold m-8 text-4xl " style={{ fontFamily: "NanumSquareExtraBold" }}>
        <span className="text-indigo-600">MUMUL 서비스</span>에서는 무엇을 할 수 있을까요?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:mt-10">
        {features.map((feature, index) => (
          <motion.div key={index} className="relative p-6 rounded-xl bg-indigo-50 cursor-pointer shadow-lg" style={{ height: "400px" }} whileHover={{ scale: 1.05 }} onHoverStart={() => setHoveredIndex(index)} onHoverEnd={() => setHoveredIndex(null)}>
            <feature.icon className={`w-12 h-12 ${hoveredIndex === index ? "text-indigo-600" : "text-indigo-400"} transition-colors duration-300`} />
            <h2 className="mt-4 text-2xl font-semibold text-indigo-800" style={{ fontFamily: "NanumSquareExtraBold" }}>{feature.text}</h2>
            <div className="mt-4 text-xl font-semibold text-gray-700" style={{ fontFamily: "NanumSquare" }}>{feature.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // 텍스트 벨트 섹션 렌더링 함수
  const renderTextBeltSection = () => (
    <div className="bg-white py-5 w-full">
      <div className="-skew-y-3 h-auto flex flex-col text-center text-white w-full py-7 bg-indigo-600" style={{ fontFamily: "NanumSquareBold" }}>
        <p style={{ fontFamily: "NanumSquareExtraBold", fontSize: "40px" }}>대충 물어봐도 찰떡같이! <br />
          <span style={{ fontFamily: "NanumSquareBold", fontSize: "30px" }}>MUMUL Bot은 사전학습 데이터 기반 AI 챗봇입니다 <br /> 고객의 문의, 대화의 맥락을 이해해서 알맞은 답변을 제공합니다.</span>
        </p>
      </div>
    </div>
  );

  // 업주 & 고객 가이드라인 섹션 랜더링 함수 (데스크탑)
  const renderGuideline = () => (
    <div className="flex flex-col items-center justify-center w-11/12 md:w-full ">
      <div name="ownerGuideline" className="w-full p-10 bg-indigo-100 mt-12 mx-4 rounded-xl">
        <p className="text-3xl md:text-4xl font-bold text-center py-4 justify-center whitespace-normal md:whitespace-nowrap mb-6 w-full " style={{ fontFamily: 'NanumSquareExtraBold' }}>
          <span className="text-indigo-600 ">MUMUL 서비스</span>는 간단히 사용 할 수 있습니다
        </p>
        <div className="flex flex-col items-center space-y-2 w-full">
          <p className="text-xl md:text-3xl font-bold text-start py-4 justify-center whitespace-normal md:whitespace-nowrap w-full text-gray-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
            <span className="text-indigo-500 ">업주</span>는 쉬운 정보 입력
          </p>
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
            {ownerSteps.map((step, index) => (<FlipCard key={index} step={step} index={index} />))}
          </div>
        </div>
        <div name="customerGuideline" className="mt-6 md:mt-10 flex items-center justify-center ">
          <div className="flex flex-col items-center space-y-2 w-full">
            <p className="text-xl md:text-3xl font-bold text-start py-4 justify-center whitespace-normal md:whitespace-nowrap w-full text-gray-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
              <span className="text-indigo-500 font-extrabold">고객</span>은 쉬운 접근
            </p>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 ">
              {customerSteps.map((step, index) => (<FlipCard key={index} step={step} index={index} />))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // MUMUL 장점 섹션 렌더링 함수 (데스크탑)
  const renderAdvantages = () => (
    <div className="w-full ">
      <div className="flex flex-col w-full mb-20">
        <p className="text-center font-semibold m-8 text-4xl" style={{ fontFamily: "NanumSquareExtraBold" }}>
          <span className="text-indigo-600">MUMUL</span>을 선택해야 하는 이유!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {goodThings.map((thing, index) => (
            <motion.div
              key={index}
              className="relative p-6 rounded-xl cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <div className="flex justify-center mb-6">
                <Image
                  src={thing.image}
                  alt={`${thing.text} 이미지`}
                  width={130}
                  height={130}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 적절한 sizes 값 설정
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-indigo-800 text-center whitespace-nowrap md:whitespace-pre-line" style={{ fontFamily: "NanumSquareExtraBold" }}>
                {thing.text}
              </h2>
              <p className="mt-4 text-gray-600 text-center whitespace-pre-line" style={{ fontFamily: "NanumSquare" }}>
                {thing.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* 활용 섹션 */}
      <div className="w-full mx-auto bg-indigo-50 overflow-hidden px-6 py-10 rounded-xl mt-12">
        <p className="text-center font-semibold m-8 text-4xl" style={{ fontFamily: "NanumSquareExtraBold" }}>
          <span className="text-indigo-600">MUMUL</span>은 <br /> 이렇게 활용됩니다
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Category buttons */}
          <div className="grid grid-cols-2 gap-4">
            {usecase.map((category, index) => (
              <motion.button
                key={index}
                className={`py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-lg text-gray-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex flex-col items-center justify-center ${index === activeCategory ? 'bg-white ' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(index)}
              >
                <category.icon className="w-10 h-10 mb-1 mx-auto text-indigo-500" />
                <h3 className="text-xl font-semibold text-center" style={{ fontFamily: "NanumSquareBold" }}>{category.name}</h3>
              </motion.button>
            ))}
          </div>

          {/* Description area */}
          {activeCategory !== null && (
            <motion.div
              className="bg-white p-4 rounded-xl shadow-lg overflow-auto mt-4"
              style={{ height: 'auto', fontFamily: "NanumSquare" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className=" mb-2 text-indigo-500" style={{ fontFamily: "NanumSquareExtraBold", fontSize: '22px' }}>
                {usecase[activeCategory].name}에서 MUMUL 활용
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">{usecase[activeCategory].description}</p>
              <p className="text-lg text-gray-700 leading-relaxed">
                <br />
                {usecase[activeCategory].exemple}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  // Features 섹션 렌더링 함수 (모바일)
  const renderFeaturesMobile = () => (
    <div className="w-full px-4">
      <p className="text-center font-semibold mb-4 text-3xl" style={{ fontFamily: "NanumSquareExtraBold" }}>
        <span className="text-indigo-600">MUMUL 서비스</span>에서는 <br /> 무엇을 할 수 있을까요?
      </p>
      <div {...swipeHandlersForFeatures} className="relative w-full bg-indigo-50 rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center space-x-4">
          <motion.div
            className="w-full flex items-start flex-col space-y-2"
            key={features[featureIndex].text}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center items-center w-full">
              {React.createElement(features[featureIndex].icon, { className: "w-12 h-12 text-indigo-600" })}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-indigo-800 mb-2" style={{ fontFamily: "NanumSquareExtraBold" }}>{features[featureIndex].text}</h3>
              <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: "NanumSquare" }}>{features[featureIndex].description}</p>
            </div>
          </motion.div>
        </div>
        {/* 하단 인디케이터 */}
        <div className="flex justify-center mt-4 space-x-2">
          {features.map((_, index) => (
            <div key={index} className={`w-3 h-3 rounded-full ${index === featureIndex ? 'bg-indigo-400' : 'bg-gray-300'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );


  // 가이드라인 섹션 렌더링 함수 (모바일) 
  const renderGuidelineMobile = () => (
    <div className="px-4">
      <div className="w-full px-2 py-6 bg-indigo-100 rounded-lg ">
        <p className="text-3xl font-bold text-center mb-4 text-gray-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
          <span className="text-indigo-600">MUMUL 서비스</span>는 <br />간단합니다
        </p>
        <div className="flex justify-center mb-6">
          <button className={`px-4 py-2 rounded-l-lg ${isOwnerStep ? "bg-indigo-500 text-white" : "bg-white text-gray-800"}`} onClick={() => setIsOwnerStep(true)}>업주 가이드라인</button>
          <button className={`px-4 py-2 rounded-r-lg ${!isOwnerStep ? "bg-indigo-500 text-white" : "bg-white text-gray-800"}`} onClick={() => setIsOwnerStep(false)}>고객 가이드라인</button>
        </div>
        <div className="relative w-full px-4 py-6 rounded-lg bg-white " style={{ height: '430px' }}>
          <div className="text-center mb-4 ">
            <div className="flex justify-center mb-2 space-x-2">
              {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-indigo-600" })}
              <h3 className="text-xl font-bold text-indigo-600 mb-2" style={{ fontFamily: "NanumSquareExtraBold" }}>{steps[currentStep].title}</h3>
            </div>
            <p className="text-gray-700 mb-8" style={{ fontFamily: "NanumSquareBold" }}>{steps[currentStep].description}</p>

            <div className="flex justify-center item-center border bordergray-600">
              <img src={steps[currentStep].image} alt={steps[currentStep].title} className="w-11/12 object-contain flex justify-center item-center rounded-lg" />
            </div>
          </div>
          {/* 화살표 버튼 */}
          <div className="absolute inset-y-1/2 left-0 transform -translate-y-1/2">
            <button className="p-2 bg-gray-500 rounded-full shadow-md hover:bg-indigo-400 transition" onClick={handlePrev}><ChevronLeft className="w-6 h-6 text-white " /></button>
          </div>
          <div className="absolute inset-y-1/2 right-0 transform -translate-y-1/2">
            <button className="p-2 bg-gray-500 rounded-full shadow-md hover:bg-indigo-400 transition" onClick={handleNext}><ChevronRight className="w-6 h-6 text-white " /></button>
          </div>
          {/* 하단 인디케이터 */}
          <div className="flex justify-center mt-4 space-x-2">
            {steps.map((_, index) => (<div key={index} className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-indigo-400' : 'bg-gray-300'}`}></div>))}
          </div>
        </div>
      </div>
    </div>
  );

  // 장점 섹션 렌더링 함수 (모바일)
  const renderAdvantagesMobile = () => (
    <div className="px-2">
      <div className="w-full px-2 space-y-10">
        {/* 장점 섹션 */}
        <div className="w-full ">
          <p className="text-3xl font-bold text-center mb-8 text-gray-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
            <span className="text-indigo-600">MUMUL</span>을 <br /> 선택해야 하는 이유!
          </p>
          {/* Swipeable 감싸기 */}
          <div {...swipeHandlersForGoodThings} className="relative w-full">
            <motion.div
              className="w-full bg-white rounded-lg p-4 flex items-start flex-col space-y-2"
              key={goodThings[goodThingIndex].text}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center items-center w-full">
                <Image src={goodThings[goodThingIndex].image} alt={`${goodThings[goodThingIndex].text} 이미지`} width={60} height={60} className="rounded-full" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2" >{goodThings[goodThingIndex].text}</h3>
                <p className="text-gray-700 text-lg leading-relaxed" >{goodThings[goodThingIndex].description}</p>
              </div>
            </motion.div>

            {/* 하단 인디케이터 */}
            <div className="flex justify-center mt-4 space-x-2">
              {goodThings.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === goodThingIndex ? 'bg-indigo-400' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* 활용 섹션 */}
        <div className="w-full py-6 bg-indigo-100 rounded-lg p-2">
          <p className="text-3xl font-bold text-center mb-5 text-gray-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
            <span className="text-indigo-600">MUMUL</span>은 <br /> 이렇게 활용됩니다
          </p>
          <div className="grid grid-cols-2 justify-center gap-2">
            {/* Category Buttons */}
            {usecase.map((category, index) => (
              <motion.button
                key={index}
                className={`py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-lg text-gray-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex flex-col items-center justify-center ${index === activeCategory ? 'bg-white ' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(index)}
              >
                <category.icon className="w-10 h-10 mb-1 mx-auto text-indigo-500" />
                <h3 className="text-xl font-semibold text-center" style={{ fontFamily: "NanumSquareBold" }}>{category.name}</h3>
              </motion.button>
            ))}
          </div>

          {/* Category Description */}
          {activeCategory !== null && (
            <motion.div
              className="bg-white p-4 rounded-xl shadow-lg overflow-auto mt-4"
              style={{ height: 'auto', fontFamily: "NanumSquare" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className=" mb-2 text-indigo-500" style={{ fontFamily: "NanumSquareExtraBold", fontSize: '22px' }}>
                {usecase[activeCategory].name}에서 MUMUL 활용
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {usecase[activeCategory].description}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                <br />
                {usecase[activeCategory].exemple}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );


  // 모바일 버전 렌더링 함수
  const renderMobileVersion = () => (
    <div className="flex flex-col items-center space-y-10">
      {renderFeaturesMobile()}
      {renderGuidelineMobile()}
      {renderAdvantagesMobile()}
    </div>
  );

  // 데스크탑 버전 렌더링 함수
  const renderDesktopVersion = () => (
    <div className="flex flex-col items-center space-y-10">
      {renderFeatures()}
      {renderTextBeltSection()}
      {renderGuideline()}
      {renderAdvantages()}
    </div>
  );

  return isMobile ? renderMobileVersion() : renderDesktopVersion();
};

export default ServiceSection;

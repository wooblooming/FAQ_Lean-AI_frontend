import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { Utensils, Monitor, ShoppingCart, Landmark } from 'lucide-react';

import { UserPlus, PencilLine, Store, QrCode, Bot, FileCode2, HelpCircle, Brain, FileText } from "lucide-react";
import WysiwygOutlinedIcon from "@mui/icons-material/WysiwygOutlined";

// 업주 가이드라인 단계별 정보를 담고 있는 배열
const ownerSteps = [
  {
    icon: UserPlus,
    title: "간단한 가입, 직관적 UI",
    description: "30초만에 가능한 가입 절차, 누구나 쉽게 접근 가능한 UI로 구성되어있습니다.",
    image: "/owner1.png",
  },
  {
    icon: PencilLine,
    title: "손쉬운 FAQ 데이터 수정",
    description: "엑셀, 한글파일로 제공되는 양식에 정보 입력하여 업로드, 초기 데이터는 영업일 기준 3일 내, 수정 데이터는 영업일 기준 1일 내 반영됩니다.",
    image: "/owner2.png",
  },
  {
    icon: Store,
    title: "실시간 매장 기본정보 수정",
    description: "배너 사진, 영업 정보, 메뉴 수정 등 간단한 매장 기본정보는 실시간으로 반영됩니다.",
    image: "/owner3.png",
  },
];

// 고객 가이드라인 단계별 정보를 담고 있는 배열
const customerSteps = [
  {
    icon: QrCode,
    title: "QR코드 스캔",
    description: "업장마다 고유의 QR코드를 제공, 테이블, 벽 의자 어디에든 설치 가능합니다",
    image: "/customer1.png",
  },
  {
    icon: WysiwygOutlinedIcon,
    title: "매장 정보 확인",
    description: "노출하시고자 하는 정보를 고객들이 확인할 수 있습니다.",
    image: "/customer2.png",
  },
  {
    icon: Bot,
    title: "AI 챗봇 '무물봇'",
    description: "사전 학습된 정보를 바탕으로 업장에 필요한 모든 정보를 제공합니다.",
    image: "/customer3.png",
  },
];

// 서비스 소개 섹션의 새로운 디자인을 반영할 features 배열
const features = [
  {
    icon: FileCode2,
    text: "고객 문의에 적합한 키워드 추천",
    description: "고객 문의의 맥락을 분석하여 최적의 키워드와 답변을 추천해줌으로써, 더욱 정확하고 신속한 응대를 가능하게 합니다."
  },
  {
    icon: HelpCircle,
    text: "자주 묻는 질문 답변 매칭",
    description: "사전에 등록된 자주 묻는 질문(FAQ)과의 매칭을 통해 반복적인 문의에 대해 자동으로 답변을 제공합니다."
  },
  {
    icon: Brain,
    text: "사전 학습 기반 답변 생성",
    description: "AI 챗봇이 사전 학습된 데이터를 바탕으로 고객의 다양한 문의에 대해 정확한 답변을 생성하고 제공합니다."
  },
  {
    icon: FileText,
    text: "고객 문의 데이터 인사이팅",
    description: "고객 문의 데이터를 분석하여 문의 유형, 빈도 등의 정보를 도출하고, 고객 응대의 개선 방향을 제시합니다."
  },
];


// MUMUL 장점 섹션에 사용할 데이터 배열
const goodThings = [
  {
    image: "/cost_saving.png",
    text: "인건 비용 절감",
    description: `반복적인 문의 응대 및 처리 작업을 자동화하여, 
    인력 운영에 따른 비용을 절감하고 보다 
    중요한 업무에 집중할 수 있도록 돕습니다.`
  },
  {
    image: "/comunications.png",
    text: "직원-고객 간 감정소비 감소",
    description: `AI 챗봇을 통해 고객의 불만이나 문의를 처리하여, 
    직원들이 겪는 감정적 소모를 줄이고 보다 
    건강한 근무 환경을 조성합니다.`
  },
  {
    image: "/efficiency.png",
    text: "업무 효율성 증대",
    description: `고객의 문의를 신속하게 해결하고 
    업무 프로세스를 최적화하여, 
    업무 효율성과 고객 만족도를 동시에 높입니다.`
  },
];

const businessCategories = [
  {
    name: "음식점",
    content: `화장실은 어디 있어요? 
    얼마나 매워요? 
    몇 명이서 먹을 수 있어요? 등 
    반복적인 질문에 대해 AI 챗봇이 대신 답변하여 요리, 매장 운영에 더 집중 하실 수 있습니다.`,
    image: "/restaurant.png"
  },
  {
    name: "무인 매장",
    content: `키오스크 어떻게 써요? 
    이 제품 언제 들어와요? 등 
    반복적인 질문들을 AI 챗봇을 통해 응답합니다. 
    매장 내 연락처로 물려오는 전화 문의를 줄여 본업에 집중하거나 여가 시간을 활용 하실 수 있습니다.`,
    image: "/unman.png"
  },
  {
    name: "소매점",
    content: `이 제품 어디에 있어요? 
    정사각형에 손바닥만한 점시 찾아주세요! 등의 
    반복적인 질문에 대해 AI 챗봇이 매장 물품 비치도와 함께 물품의 위치를 제공합니다.`,
    image: "/retail.png"
  },
  {
    name: "공공 기관",
    content: `소상공인 정부 지원금 신청 어디서 해요? 
    이번 달 수영 시간표 알려주세요! 등의 
    민원들의 반복적인 질문들을 AI 챗봇을 통해 응답합니다.`,
    image: "/public.png"
  }
];

const categories = [
  { name: "식당", icon: Utensils },
  { name: "무인매장", icon: Monitor },
  { name: "소매점", icon: ShoppingCart },
  { name: "공공기관", icon: Landmark },
];

const descriptions = [
  {
    description: "화장실은 어디 있어요? 이 메뉴 얼마나 매워요? 몇 명이서 먹을 수 있어요? 주차는 어디에 해요? 등 반복적인 질문에 대해 AI 챗봇이 대신 답변하여 오리, 매장 운영에 더 집중하실 수 있습니다.",
    exemple: "- 1인 운영 매장, 인력 감축 희망 매장 등"
  },
  {
    description: "키오스크 어떻게 써요? 이 물건 언제 들어와요? 물품 반납 어떻게 해요? 등 반복적인 질문들은 AI 챗봇을 통해 응대합니다. 매장 내 연락처로 몰려오는 전화 문의를 줄여 본업에 집중하거나 야간 시간을 활용하실 수 있습니다.",
    exemple: "- 무인 스터디카페, 무인 숙박업소(에어비앤비), 무인 식료품점, 무인 스포츠업장 등"
  },
  {
    description: "이 물건 어디 있어요? 정사각형에 손바닥만 한 크기 접시 찾아주세요! 등의 반복적인 질문에 대해 AI 챗봇이 매장 물품 배치도와 함께 물품의 위치를 제공합니다.",
    exemple: "- 대형 편의점, 동네 마트, 철물점, 다이소 등"
  },
  {
    description: "소상공인 정부 지원금 신청 어디서 해요? 이번 달 수영 시간표 알려주세요! 등 민원인들의 반복적인 질문들을 AI 챗봇을 통해 응대합니다.",
    exemple: "- 복지센터, 체육센터, 행정센터 등"
  }
];

// FlipCard 컴포넌트 정의
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
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* 카드 앞면 */}
        <div
          className="absolute w-full h-full backface-hidden "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Image
            src={step.image}
            alt={`Step ${index + 1} illustration`}
            fill
            style={{objectFit:"cover"}}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 적절한 sizes 값 설정
            className="rounded-lg"
          />
          <div className="absolute bottom-4 right-4 text-indigo-500">
            <p className="text-sm" style={{ fontFamily: "NanumSquareBold" }}>
              클릭하여 자세히 보기
            </p>
          </div>
        </div>

        {/* 카드 뒷면 */}
        <div
          className="absolute w-full h-full backface-hidden bg-indigo-200 rounded-lg shadow-lg p-6 flex flex-col justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center mb-3">
            <div className="bg-indigo-50 rounded-full p-3 mr-2">
              <step.icon className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-2xl text-gray-900 whitespace-pre-line" style={{ fontFamily: "NanumSquareExtraBold" }}>
              {step.title}
            </h3>
          </div>
          <p className="text-gray-700 text-lg" style={{ fontFamily: "NanumSquareBold" }}>
            {step.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ServiceSection 컴포넌트 정의
const ServiceSection = ({ isMobile }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(businessCategories[0]);

  const [activeCategory, setActiveCategory] = useState(null);

  // 텍스트 벨트 섹션 렌더링 함수
  const renderTextBeltSection = () => (
    <div className="bg-white py-10">
      <div className="-skew-y-3 h-auto flex flex-col text-center text-white w-full py-7 bg-indigo-600" style={{ fontFamily: "NanumSquareBold" }}>
        <p style={{ fontFamily: "NanumSquareExtraBold", fontSize: "40px" }}>
          대충 물어봐도 찰떡같이! <br />
          <span style={{ fontFamily: "NanumSquareBold", fontSize: "30px" }}>
            MUMUL Bot은 사전학습 데이터 기반 AI 챗봇입니다 <br />
            고객의 문의, 대화의 맥락을 이해해서 알맞은 답변을 제공합니다.
          </span>
        </p>
      </div>
    </div>
  );

  // 업주 & 고객 가이드라인 섹션
  const renderGuideline = () => (
    <>
      <div className="flex flex-col items-center justify-center w-11/12 md:w-full bg-white px-6 py-10">
        <div name="ownerGuideline" className="w-full p-10 bg-indigo-100 mt-12 mx-4 rounded-xl">
          <p className="text-3xl md:text-4xl font-bold text-center py-4 justify-center whitespace-normal md:whitespace-nowrap mb-6 w-full " style={{ fontFamily: 'NanumSquareExtraBold' }}>
            <span className="text-indigo-600 ">MUMUL 서비스</span>는 간단하게 사용 할 수 있습니다
          </p>
          <div className="flex flex-col items-center space-y-2 w-full">
            <p className="text-xl md:text-3xl font-bold text-start py-4 justify-center whitespace-normal md:whitespace-nowrap w-full text-gray-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
              <span className="text-indigo-500 ">업주</span>는 쉬운 정보 입력
            </p>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
              {ownerSteps.map((step, index) => (
                <FlipCard key={index} step={step} index={index} />
              ))}
            </div>
          </div>

          <div name="customerGuideline" className="mt-6 md:mt-10 flex items-center justify-center ">
            <div className="flex flex-col items-center space-y-2 w-full">
              <p className="text-xl md:text-3xl font-bold text-start py-4 justify-center whitespace-normal md:whitespace-nowrap w-full text-gray-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                <span className="text-indigo-500 font-extrabold">고객</span>은 쉬운 접근
              </p>

              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 ">
                {customerSteps.map((step, index) => (
                  <FlipCard key={index} step={step} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div></div>
    </>
  );

  // MUMUL 장점 섹션 렌더링 함수
  const renderGoodThings = () => (
    <div className="w-full bg-white px-6 py-10 rounded-lg">
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

      <div name="useful1" className="w-full mx-auto bg-indigo-50 overflow-hidden px-6 py-10 rounded-xl">
        <p className="text-center font-semibold m-8 text-4xl" style={{ fontFamily: "NanumSquareExtraBold" }}>
          <span className="text-indigo-600">MUMUL</span>은 이런 상황에 유용합니다
        </p>

        <div className="flex flex-row w-full items-start space-x-20">
          {/* 왼쪽 카테고리 버튼 목록 */}
          <div className="flex flex-col w-1/4 space-y-4">
            {businessCategories.map((category) => (
              <button
                key={category.name}
                className={`w-full px-4 py-2 text-left text-2xl rounded-lg transition-colors ${selectedCategory.name === category.name ? 'bg-indigo-500 text-white' : 'text-gray-800'
                  }`}
                style={{
                  fontFamily: selectedCategory.name === category.name ? 'NanumSquareExtraBold' : 'NanumSquareBold'
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* 중앙 설명 영역 */}
          <motion.div
            className="w-1/3"
            key={selectedCategory.name} // 애니메이션을 트리거하기 위해 고유 key 필요
            initial={{ opacity: 0, y: 50 }} // 아래에서 위로 올라오도록 초기 Y 위치 조정
            animate={{ opacity: 1, y: 0 }}  // 최종 Y 위치 설정 (원래 위치)
            exit={{ opacity: 0, y: 50 }}    // 사라질 때 다시 아래로 내려감
            transition={{ duration: 0.7 }}  // 애니메이션 지속 시간
          >
            <div className="flex-1 text-gray-700 whitespace-nowrap md:whitespace-pre-line" style={{ fontSize: '22px', fontFamily: 'NanumSquareBold' }}>
              {selectedCategory.content}
            </div>
          </motion.div>

          {/* 오른쪽 이미지 영역 */}
          <motion.div
            className="w-1/4 rounded-full overflow-hidden"
            key={selectedCategory.image} // 애니메이션을 트리거하기 위해 고유 key 필요
            initial={{ opacity: 0, scale: 0.5 }} // 초기 상태 (투명도 및 크기)
            animate={{ opacity: 1, scale: 1 }}   // 최종 상태
            exit={{ opacity: 0, scale: 0.8 }}    // 사라질 때 애니메이션
            transition={{ duration: 0.9 }}       // 애니메이션 지속 시간
          >
            <img
              src={selectedCategory.image}
              alt={selectedCategory.name}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </div>




      <div name="useful2" className="w-full mx-auto bg-indigo-50 overflow-hidden px-6 py-10 rounded-xl mt-12">
  <p className="text-center font-semibold m-8 text-4xl" style={{ fontFamily: "NanumSquareExtraBold" }}>
    <span className="text-indigo-600">MUMUL</span>은 이런 상황에 유용합니다
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
    {/* Category buttons */}
    <div className="grid grid-cols-2 gap-4 ">
      {categories.map((category, index) => (
        <motion.button
          key={index}
          className={`py-3 rounded-lg transition-all duration-300 hover:bg-indigo-200 hover:shadow-lg text-gray-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`} // 버튼 폭 및 패딩 설정
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory(index)}
        >
          {/* 아이콘은 기존 크기를 유지 */}
          <category.icon className="w-12 h-12 mb-2 mx-auto" />
          {/* 텍스트 크기 및 정렬 */}
          <h3 className="text-lg font-semibold text-center" style={{ fontFamily: "NanumSquareBold" }}>
            {category.name}
          </h3>
        </motion.button>
      ))}
    </div>

    {/* Description area */}
    {activeCategory !== null && (
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg overflow-auto" // height 고정 및 overflow 설정
        style={{height:'305px'}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <h3 className="text-2xl font-bold mb-4 text-indigo-500" style={{ fontFamily: "NanumSquareExtraBold" }}>
              {categories[activeCategory].name}에서의 MUMUL 활용
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed" style={{ fontFamily: "NanumSquare" }}>
              {descriptions[activeCategory].description}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed" style={{ fontFamily: "NanumSquare" }}>
              <br />
              {descriptions[activeCategory].exemple}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )}
  </div>
</div>


    </div>

  );

  // 모바일 버전 렌더링 함수
  const renderMobileVersion = () => (
    <div className="flex flex-col items-center">
      <p className="text-center font-semibold mt-2 mb-4 text-3xl" style={{ fontFamily: "NanumSquareExtraBold" }}>
        <span className="text-indigo-600">MUMUL 서비스</span>에서는 <br />
        무엇을 할 수 있을까요?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="relative p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <feature.icon className={`w-12 h-12 ${hoveredIndex === index ? "text-indigo-600" : "text-indigo-400"} transition-colors duration-300`} />
            <h2 className="mt-4 text-lg font-semibold text-indigo-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
              {feature.text}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* 가이드라인 섹션 추가 */}
      {renderGuideline()}
    </div>
  );

  // 데스크탑 버전 렌더링 함수
  const renderDesktopVersion = () => (
    <div>
      {/* 서비스 소개 섹션 */}
      <div className="w-full bg-white p-6 rounded-lg">
        <div className="flex flex-col w-full mb-20">
          <p className="text-center font-semibold m-8 text-4xl" style={{ fontFamily: "NanumSquareExtraBold" }}>
            <span className="text-indigo-600">MUMUL 서비스</span>에서는 무엇을 할 수 있을까요?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:mt-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative p-6 rounded-xl bg-indigo-50 cursor-pointer shadow-lg"
                style={{ height: "400px" }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <feature.icon className={`w-12 h-12 ${hoveredIndex === index ? "text-indigo-600" : "text-indigo-400"} transition-colors duration-300`} />
                <h2 className="mt-4 text-2xl font-semibold text-indigo-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
                  {feature.text}
                </h2>
                <div className="mt-4 text-xl font-semibold text-gray-700" style={{ fontFamily: "NanumSquare" }}>
                  {feature.description}
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 텍스트 벨트 섹션 추가 */}
      {renderTextBeltSection()}

      {/* 가이드라인 섹션 추가 */}
      {renderGuideline()}

      {/* 장점 섹션 추가 */}
      {renderGoodThings()}
    </div>
  );

  return isMobile ? renderMobileVersion() : renderDesktopVersion();
};

export default ServiceSection;

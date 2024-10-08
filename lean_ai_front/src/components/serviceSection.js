"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { UserPlus, PencilLine, Store, QrCode, Bot, FileCode2, HelpCircle, Brain, FileText } from "lucide-react";
import WysiwygOutlinedIcon from '@mui/icons-material/WysiwygOutlined';

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
    title: `손쉬운 FAQ 데이터 수정`,
    description: "엑셀, 한글파일로 제공되는 양식에 정보 입력하여 업로드, 초기 데이터는 영업일 기준 3일 내, 수정 데이터는 영업일 기준 1일 내 반영됩니다.",
    image: "/owner2.png",
  },
  {
    icon: Store,
    title: `실시간 매장 
    기본정보 수정`,
    description: "배너 사진, 영업 정보, 메뉴 수정 등 간단한 매장 기본정보는 실시간으로 반영됩니다.",
    image: "/owner3.png",
  }
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
  }
];

// 서비스 소개 섹션의 새로운 디자인을 반영할 features 배열
const features = [
  { icon: FileCode2, text: "고객 문의에 적합한 키워드 추천", description: "" },
  { icon: HelpCircle, text: "자주 묻는 질문 답변 매칭", description: "" },
  { icon: Brain, text: "사전 학습 기반 답변 생성", description: "" },
  { icon: FileText, text: "고객 문의 데이터 인사이팅", description: "" },
];

// FlipCard 컴포넌트 정의 (수정됨)
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
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* 카드 앞면 */}
        <div
          className="absolute w-full h-full backface-hidden border border-gray-400"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <Image
            src={step.image}
            alt={`Step ${index + 1} illustration`}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute bottom-4 right-4 text-indigo-500">
            <p className="text-sm" style={{ fontFamily: 'NanumSquareBold' }}>클릭하여 자세히 보기</p>
          </div>
        </div>

        {/* 카드 뒷면 */}
        <div
          className="absolute w-full h-full backface-hidden bg-indigo-200 rounded-lg shadow-lg p-6 flex flex-col justify-center "
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex items-center mb-3">
            <div className="bg-indigo-50 rounded-full p-3 mr-2">
              <step.icon className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-2xl text-gray-900 whitespace-pre-line " style={{ fontFamily: 'NanumSquareExtraBold' }}>{step.title}</h3>
          </div>
          <p className="text-gray-700 text-lg" style={{ fontFamily: 'NanumSquareBold' }}> {step.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ServiceSection 컴포넌트 정의
const ServiceSection = ({ isMobile }) => {
  // `hoveredIndex` 상태를 최상위 컴포넌트에서 정의하여 하위 함수에서 참조할 수 있도록 설정
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 업주 & 고객 가이드라인 섹션 추가
  const renderGuideline = () => (
    <>
      <div className="flex flex-col items-center justify-center w-11/12 md:w-full ">
        <div name="ownerGuideline" className="w-full p-6 bg-violet-100 mt-12 mx-4">
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

  // 모바일 버전의 렌더링 구성 함수
  const renderMobileVersion = () => (
    <div className="flex flex-col items-center">
      <p className="text-center font-semibold mt-2 mb-4 text-3xl" style={{ fontFamily: 'NanumSquareExtraBold' }}>
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
            <feature.icon
              className={`w-12 h-12 ${hoveredIndex === index ? "text-indigo-600" : "text-indigo-400"} transition-colors duration-300`}
            />
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

  // 데스크탑 버전의 렌더링 구성 함수
  const renderDesktopVersion = () => (
    <>
      <div className="w-full bg-white p-6 ">
        {/* 서비스 소개 섹션 */}
        <div className="flex flex-col w-full mb-20">
          <p className="text-center font-semibold m-8 text-4xl" style={{ fontFamily: 'NanumSquareExtraBold' }}>
            <span className="text-indigo-600">MUMUL 서비스</span>에서는 무엇을 할 수 있을까요?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:mt-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative p-6 rounded-xl bg-violet-100 cursor-pointer"
                style={{ height: '450px' }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <feature.icon
                  className={`w-12 h-12 ${hoveredIndex === index ? "text-indigo-600" : "text-indigo-400"} transition-colors duration-300`}
                />
                <h2 className="mt-4 text-xl font-semibold text-indigo-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
                  {feature.text}
                </h2>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 텍스트 벨트 섹션 */}
      <div className="bg-white py-10">

        <div className="-skew-y-3 h-auto flex flex-col text-center text-white w-full py-7 bg-indigo-600" style={{ fontFamily: 'NanumSquareBold' }}>
          <p style={{ fontFamily: 'NanumSquareExtraBold', fontSize: '40px' }}>
            대충 물어봐도 찰떡같이! <br />
            <span style={{ fontFamily: 'NanumSquareBold', fontSize: '30px' }}>
              MUMUL Bot은 사전학습 데이터 기반 AI 챗봇입니다 <br />
              고객의 문의, 대화의 맥락을 이해해서 알맞은 답변을 제공합니다.
            </span>
          </p>
        </div>
      </div>
      <div className="w-full bg-white p-6">


        {/* 가이드라인 섹션 추가 */}
        {renderGuideline()}
      </div>
    </>
  );

  // 최종 반환: 모바일 버전인지 아닌지에 따라 다른 렌더링 함수를 호출
  return isMobile ? renderMobileVersion() : renderDesktopVersion();
};

export default ServiceSection;

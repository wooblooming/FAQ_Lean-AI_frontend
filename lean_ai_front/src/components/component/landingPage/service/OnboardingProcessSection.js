"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck2,
  SearchCheck,
  BotMessageSquare,
  Rocket,
  ChevronRight,
  Star,
  CheckCircle,
  PlusCircle,
  X,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react";

// Enhanced steps data with additional details
const steps = [
  {
    icon: <CalendarCheck2 className="w-7 h-7" />,
    title: "상담 및 데모 신청",
    description:
      "궁금한 점을 문의주시면, 1:1 데모와 상담을 통해 무물을 소개해드려요.",
    accent: "#818cf8",
    details: [
      { icon: <Users size={18} />, text: "전담 컨설턴트 배정" },
      { icon: <MessageSquare size={18} />, text: "1:1 맞춤형 상담 진행" },
      { icon: <FileText size={18} />, text: "무물 솔루션 상세 설명 및 데모" },
    ],
    casestudy:
      "A 커피숍은 상담을 통해 메뉴와 매장 정보를 챗봇으로 응대하는 방법을 알게 되었습니다.",
  },
  {
    icon: <SearchCheck className="w-7 h-7" />,
    title: "업종 맞춤 진단",
    description:
      "업종과 고객 유형에 맞는 챗봇 구성 및 예상 성과를 안내해드려요.",
    accent: "#6366f1",
    details: [
      { icon: <FileText size={18} />, text: "업종별 맞춤 분석 보고서" },
      { icon: <CheckCircle size={18} />, text: "고객 패턴 및 니즈 파악" },
      { icon: <Star size={18} />, text: "기대 효과 및 ROI 분석" },
    ],
    casestudy:
      "B 병원은 진료과별 FAQ와 예약 문의가 가장 많다는 진단을 받고 이에 최적화된 솔루션을 도입했습니다.",
  },
  {
    icon: <BotMessageSquare  className="w-7 h-7" />,
    title: "데이터 연동 및 챗봇 구축",
    description: "FAQ, 문서 등 기존 데이터를 기반으로 맞춤형 챗봇을 구성해요.",
    accent: "#4f46e5",
    details: [
      { icon: <FileText size={18} />, text: "기존 FAQ 및 문서 분석" },
      { icon: <MessageSquare size={18} />, text: "응답 시나리오 설계" },
      { icon: <CheckCircle size={18} />, text: "데이터 최적화 및 학습" },
    ],
    casestudy:
      "C 공공기관은 기존 민원 데이터 5,000건을 연동해 24시간 민원 응대 챗봇을 구축했습니다.",
  },
  {
    icon: <Rocket className="w-7 h-7" />,
    title: "테스트 및 서비스 오픈",
    description:
      "실사용 테스트를 거쳐, 고객 응대에 바로 활용할 수 있도록 런칭해요.",
    accent: "#4338ca",
    details: [
      { icon: <CheckCircle size={18} />, text: "내부 테스트 및 피드백 반영" },
      { icon: <MessageSquare size={18} />, text: "챗봇 응답 정확도 개선" },
      { icon: <Rocket size={18} />, text: "실시간 모니터링 및 지원" },
    ],
    casestudy:
      "D 쇼핑몰은 2주간의 테스트 후 고객 문의 응대 시간을 75% 절감했습니다.",
  },
];

const OnboardingProcessSection = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  // 단계 클릭 시 세부 정보 표시 토글
  const toggleStepDetails = (index) => {
    if (selectedStep === index) {
      setSelectedStep(null);
    } else {
      setSelectedStep(index);
    }
  };

  // 호버 상태 관리
  const handleStepHover = (index) => {
    setActiveStep(index);
  };

  const handleStepLeave = () => {
    setActiveStep(null);
  };

  return (
    <section className="py-28 px-4 bg-white/50 to-white overflow-hidden relative font-NanumSquareBold">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced header with animated elements */}
        <motion.div
          className="text-center mb-24 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          

          <h2 className="text-4xl md:text-5xl font-NanumSquareExtraBold text-gray-900 mb-6 relative inline-block">
            <span className="relative bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              무물 도입 절차
            </span>
          </h2>

          <motion.p
            className="text-lg max-w-2xl mx-auto text-gray-600 leading-relaxed font-NanumSquare"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            도입은 어렵지 않아요. <br /> 아래 단계를 따라가면 무물을 바로 시작할
            수 있어요! <br />
            <span className="text-indigo-600 text-sm mt-2 inline-block">
              각 단계를 클릭하면 더 자세한 정보를 확인할 수 있어요.
            </span>
          </motion.p>
        </motion.div>

        {/* Enhanced timeline with 3D effects and interactivity */}
        <div className="mb-24 relative">
          {/* Desktop connection line with animated progress */}
          <div className="hidden md:block absolute top-[140px] left-[10%] w-[80%] h-2 transform">
            <div className="w-full h-full bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-600 rounded-full"></div>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white"
              style={{ originX: 1 }}
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="relative z-10"
                onMouseEnter={() => handleStepHover(index)}
                onMouseLeave={handleStepLeave}
                onClick={() => toggleStepDetails(index)}
              >
                {/* 3D enhanced step card with interactivity */}
                <div className="relative h-full group perspective">
                  {/* Step number with enhanced styling */}
                  <div
                    className="absolute -top-5 -left-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-lg font-bold shadow-xl z-20 border-2 transform group-hover:scale-110 transition-transform"
                    style={{ borderColor: step.accent, color: step.accent }}
                  >
                    {index + 1}
                  </div>

                  {/* Connection dots for desktop with animation */}
                  <div className="hidden md:block absolute top-[140px] left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-white border-4 border-indigo-500 z-20"></div>
                      <motion.div
                        className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-indigo-200/50"
                        animate={{
                          scale: activeStep === index ? [1, 1.3, 1] : 1,
                          opacity: activeStep === index ? [0.5, 0.7, 0.5] : 0.5,
                        }}
                        transition={{
                          repeat: activeStep === index ? Infinity : 0,
                          duration: 2,
                        }}
                      ></motion.div>
                    </div>
                  </div>

                  {/* 3D Card content with enhanced styling and hover effects */}
                  <motion.div
                    className={`bg-white rounded-2xl p-8 h-full transition-all duration-500 shadow-lg overflow-hidden relative ${
                      selectedStep === index ? "ring-2 ring-indigo-500" : ""
                    }`}
                    style={{
                      boxShadow: `0 20px 30px -10px ${step.accent}20, 0 10px 20px -10px ${step.accent}10`,
                      transform: `perspective(1000px) ${
                        activeStep === index
                          ? "rotateY(5deg) rotateX(2deg)"
                          : "rotateY(0) rotateX(0)"
                      }`,
                    }}
                    whileHover={{
                      boxShadow: `0 25px 40px -10px ${step.accent}30, 0 15px 25px -10px ${step.accent}20`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    {/* Card top accent with glow effect */}
                    <div
                      className="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl"
                      style={{
                        backgroundColor: step.accent,
                        boxShadow: `0 0 10px ${step.accent}80`,
                      }}
                    ></div>

                    <div className="flex flex-col items-center text-center relative">
                      {/* Icon with enhanced 3D styling */}
                      <motion.div
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center mb-6 relative shadow-lg"
                        style={{ color: step.accent }}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                        }}
                      >
                        {step.icon}
                        <div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-30"
                          style={{
                            backgroundImage: `linear-gradient(to bottom right, ${step.accent}20, ${step.accent}40)`,
                          }}
                        ></div>
                      </motion.div>

                      {/* Title with custom styling and hover effect */}
                      <h3 className="font-bold text-xl text-gray-900 mb-4 relative group-hover:text-indigo-700 transition-colors">
                        {step.title}
                      </h3>

                      {/* Description with enhanced typography */}
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Show details button */}
                      <button
                        className="my-6 flex items-center text-indigo-600 font-medium text-sm group"
                        aria-expanded={selectedStep === index}
                        aria-controls={`step-details-${index}`}
                      >
                        <span>
                          {selectedStep === index
                            ? "상세 정보 닫기"
                            : "상세 정보 보기"}
                        </span>
                        <motion.div
                          animate={{ rotate: selectedStep === index ? 45 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-1"
                        >
                          {selectedStep === index ? (
                            <X size={16} />
                          ) : (
                            <PlusCircle size={16} />
                          )}
                        </motion.div>
                      </button>

                      {selectedStep === index && (
                        <motion.div
                          id={`step-details-${index}`}
                          className="border-t border-violet-200 w-full pt-4 flex items-center justify-center text-center"
                          style={{ borderLeftColor: step.accent }}
                          initial={{ opacity: 0, height: 0, y: -20 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center justify-center text-center mb-4">
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <motion.li
                                  key={idx}
                                  className="flex items-start gap-3"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 + 0.2 }}
                                >
                                  <span className="text-indigo-600 mt-0.5">
                                    {detail.icon}
                                  </span>
                                  <span className="text-gray-700">{detail.text}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Mobile connection indication */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                      <ChevronRight className="w-6 h-6 text-indigo-400 transform rotate-90" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingProcessSection;

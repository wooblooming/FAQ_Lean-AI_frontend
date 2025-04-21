"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Sparkles, 
  SearchCheck, 
  MessageSquareText, 
  Reply,
  ChevronRight,
  BrainCircuit
} from "lucide-react";

// 기존 코드에서 색상 계열을 indigo / violet 계열로 조정한 버전입니다

const flowSteps = [
    {
      id: "step-1",
      icon: MessageSquareText,
      title: "질문 입력",
      description: "Q: 포장 되나요?",
      detail:
        '고객이 챗봇에게 질문을 입력합니다. 예를 들어, "포장 되나요?"와 같은 질문이 들어오면 이 내용을 처리하기 위한 분석이 시작됩니다.',
      colors: {
        primary: "#6366f1", // indigo-500
        secondary: "#818cf8", // indigo-400
        light: "#c7d2fe", // indigo-200
        ultraLight: "#eef2ff", // indigo-50
      },
    },
    {
      id: "step-2",
      icon: SearchCheck,
      title: "자연어 처리",
      description: '키워드 분석: "포장"',
      detail:
        '입력된 질문에서 핵심 키워드와 문맥을 분석합니다. 이 경우, "포장"이라는 단어가 주요 키워드로 추출되어 의도를 파악하게 됩니다.',
      colors: {
        primary: "#6366f1",
        secondary: "#818cf8",
        light: "#c7d2fe",
        ultraLight: "#eef2ff",
      },
    },
    {
      id: "step-3",
      icon: BrainCircuit,
      title: "FAQ or AI 검색",
      description: "사전 등록된 데이터 또는 LLM 활용",
      detail:
        "분석된 키워드를 기반으로 사전에 등록된 FAQ 데이터와 매칭하거나, LLM(AI 언어 모델)을 통해 가장 적합한 답변을 생성합니다.",
      colors: {
        primary: "#6366f1",
        secondary: "#818cf8",
        light: "#c7d2fe",
        ultraLight: "#eef2ff",
      },
    },
    {
      id: "step-4",
      icon: Reply,
      title: "응답 제공",
      description: 'A: "포장 가능합니다. 카운터에 말씀해주세요!"',
      detail:
        '고객이 이해하기 쉬운 방식으로 답변을 제공합니다. 예: "포장 가능합니다. 카운터에 말씀해주세요!"와 같은 안내 메시지가 출력됩니다.',
      colors: {
        primary: "#6366f1",
        secondary: "#818cf8",
        light: "#c7d2fe",
        ultraLight: "#eef2ff",
      },
    },
  ];
  
  

export default function ChatbotFlowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [headingRef, headingInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const timelineRefs = useRef([]);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Dynamic autoplay control
  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === flowSteps.length - 1 ? 0 : prev + 1));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoplay]);
  
  // Get current step data
  const currentStep = flowSteps[activeStep];
  const ActiveIcon = currentStep.icon;

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 w-full overflow-hidden relative font-NanumSquareExtraBold"
      style={{
        background: `radial-gradient(circle at 20% 30%, ${currentStep.colors.ultraLight}, transparent 70%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Dynamic blur blobs */}
            <div 
              className="absolute rounded-full filter blur-3xl opacity-10"
              style={{ 
                width: "60vw", 
                height: "60vw", 
                right: "-20vw", 
                top: "-20vw", 
                background: `linear-gradient(135deg, ${currentStep.colors.primary}88, ${currentStep.colors.secondary}33)`,
                transform: `rotate(${scrollY * 0.02}deg) translateY(${scrollY * 0.1}px)`,
              }}
            />
            <div 
              className="absolute rounded-full filter blur-3xl opacity-10"
              style={{ 
                width: "40vw", 
                height: "40vw", 
                left: "-10vw", 
                bottom: "-10vw", 
                background: `linear-gradient(135deg, ${currentStep.colors.secondary}88, ${currentStep.colors.primary}33)`,
                transform: `rotate(${-scrollY * 0.02}deg) translateY(${-scrollY * 0.05}px)`,
              }}
            />
            
            {/* Small decorative particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{ 
                  backgroundColor: i % 2 === 0 ? currentStep.colors.primary : currentStep.colors.secondary,
                  opacity: 0.1,
                  left: `${10 + i * 20}%`,
                  top: `${50 + (i % 3) * 15}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header Section */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-2 relative inline-block"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            {["무", "물", "\u00A0", "챗", "봇", "은", "\u00A0", "이", "렇", "게", "\u00A0", "작", "동", "해", "요", "!"].map(
              (char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={headingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className="inline-block"
                  style={{ color: currentStep.colors.primary }}
                >
                  {char}
                </motion.span>
              )
            )}
          </h2>

          <div
            className="text-indigo-700 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "NanumSquare" }}
          >
            {"단순하지만 강력한 AI의 질문 처리 및 응답 과정을 알아보세요"
              .split("")
              .map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.8 + index * 0.02, // 헤딩 애니메이션 후에 시작하도록 기본 딜레이 0.8 추가
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
          </div>
        </motion.div>

        {/* Main Process Section with glass morphism */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl p-8 md:p-10 bg-white bg-opacity-40 backdrop-blur-sm border border-white border-opacity-50"
          style={{
            boxShadow: `0 30px 80px -20px ${currentStep.colors.primary}33, 0 0 0 1px ${currentStep.colors.light}`,
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-10">
            {/* Left Column - Active Step Display with enhanced design */}
            <div className="w-full lg:w-1/2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  className="h-full"
                >
                  <div
                    className="h-full rounded-xl p-8 relative overflow-hidden flex flex-col"
                    style={{
                      background: `linear-gradient(135deg, ${currentStep.colors.light}90, ${currentStep.colors.ultraLight}CC)`,
                      boxShadow: `0 20px 40px -20px ${currentStep.colors.primary}55`,
                      border: `1px solid ${currentStep.colors.light}`
                    }}
                  >
                    {/* Step header with icon */}
                    <div className="flex items-center gap-5 mb-8 relative z-10">
                      <motion.div
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${currentStep.colors.secondary}, ${currentStep.colors.primary})`,
                          boxShadow: `0 15px 30px -10px ${currentStep.colors.primary}99`
                        }}
                      >
                        <ActiveIcon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h3
                          className="text-2xl font-bold mb-1"
                          style={{ 
                            fontFamily: "NanumSquareExtraBold",
                            color: currentStep.colors.primary
                          }}
                        >
                          {currentStep.title}
                        </h3>
                        <div 
                          className="flex items-center gap-3 text-sm font-medium px-3 py-1 rounded-full"
                          style={{ 
                            background: currentStep.colors.ultraLight,
                            color: currentStep.colors.primary
                          }}
                        >
                          <span>단계 {activeStep + 1} / {flowSteps.length}</span>
                          <span className="flex space-x-1">
                            {flowSteps.map((_, idx) => (
                              <motion.span
                                key={idx}
                                className="block w-1.5 h-1.5 rounded-full"
                                style={{ 
                                  backgroundColor: idx === activeStep 
                                    ? currentStep.colors.primary 
                                    : currentStep.colors.light
                                }}
                                animate={{ scale: idx === activeStep ? [1, 1.5, 1] : 1 }}
                                transition={{ duration: 1, repeat: idx === activeStep ? Infinity : 0, repeatDelay: 1 }}
                              />
                            ))}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step description */}
                    <div className="flex-1 relative z-10">
                      {/* Example display box */}
                      <div 
                        className="mb-6 px-5 py-4 rounded-lg text-lg relative overflow-hidden group bg-white/50"
                        style={{
                         
                          border: `1px solid ${currentStep.colors.light}`,
                          color: currentStep.colors.primary
                        }}
                      >
                        <div className="font-medium" style={{ fontFamily: "NanumSquare" }}>
                          {currentStep.description}
                        </div>
                      </div>
                      
                      {/* Detailed explanation */}
                      <p
                        className="text-lg leading-relaxed"
                        style={{ 
                          fontFamily: "NanumSquare",
                          color: "#475569" // slate-600
                        }}
                      >
                        {currentStep.detail}
                      </p>
                    </div>
                    
                    {/* Step control */}
                    <div className="mt-6 flex items-center justify-end relative z-10">
                      <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-1 py-2 px-5 rounded-full font-medium"
                        style={{
                            fontFamily: "NanumSquareBold",
                          background: `linear-gradient(to right, ${currentStep.colors.secondary}, ${currentStep.colors.primary})`,
                          color: "white",
                          boxShadow: `0 10px 20px -10px ${currentStep.colors.primary}99`
                        }}
                        onClick={() => {
                          setActiveStep((prev) => (prev === flowSteps.length - 1 ? 0 : prev + 1));
                          setIsAutoplay(false);
                        }}
                      >
                        <span>다음 단계</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Right Column - Enhanced Timeline */}
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col h-full">
                <h4 
                  className="text-lg font-semibold mb-6 flex items-center gap-2"
                  style={{ 
                    fontFamily: "NanumSquareExtraBold",
                    color: currentStep.colors.primary
                  }}
                >
                  <span>처리 흐름</span>
                  <div className="h-px flex-1" style={{ background: `${currentStep.colors.light}` }}></div>
                </h4>
                
                {/* Timeline steps */}
                <div className="flex-1 space-y-5 relative">
                  {/* Vertical timeline connector */}
                  <div 
                    className="absolute top-8 bottom-8 left-8 w-0.5 rounded"
                    style={{ background: `linear-gradient(to bottom, ${currentStep.colors.light}, ${flowSteps[flowSteps.length-1].colors.light})` }}
                  />
                  
                  {flowSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = activeStep === index;
                    
                    return (
                      <motion.div
                        ref={el => timelineRefs.current[index] = el}
                        key={step.id}
                        initial={false}
                        animate={{ 
                          backgroundColor: isActive 
                            ? `${step.colors.ultraLight}` 
                            : 'rgba(255, 255, 255, 0.6)',
                          boxShadow: isActive 
                            ? `0 15px 30px -10px ${step.colors.primary}44` 
                            : '0 2px 10px rgba(0, 0, 0, 0.03)',
                          borderColor: isActive 
                            ? step.colors.light
                            : 'rgba(255, 255, 255, 0.7)'
                        }}
                        whileHover={{ 
                          backgroundColor: step.colors.ultraLight,
                          y: -3,
                          transition: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                        className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl border transition-all duration-300`}
                        onClick={() => {
                          setActiveStep(index);
                          setIsAutoplay(false);
                        }}
                        onMouseEnter={() => setIsAutoplay(false)}
                      >
                        {/* Step icon */}
                        <motion.div
                          animate={{ 
                            scale: isActive ? 1.1 : 1,
                            background: isActive
                              ? `linear-gradient(135deg, ${step.colors.secondary}, ${step.colors.primary})`
                              : 'white',
                            color: isActive ? 'white' : step.colors.primary,
                            boxShadow: isActive
                              ? `0 10px 30px -5px ${step.colors.primary}55`
                              : `0 5px 15px -5px rgba(0, 0, 0, 0.1)`
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="relative z-10 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        >
                          <StepIcon className="w-7 h-7" />
                          
                          {/* Pulse effect for active step */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-xl"
                              style={{ 
                                boxShadow: `0 0 0 6px ${step.colors.primary}20`,
                                background: 'transparent',
                              }}
                              animate={{ 
                                opacity: [0.7, 0],
                                scale: [1, 1.2],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                            />
                          )}
                          
                          {/* Active indicator */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -right-1 -top-1 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: step.colors.primary }}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        
                        {/* Step content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className="font-semibold text-lg"
                              style={{ 
                                fontFamily: "NanumSquareExtraBold",
                                color: isActive 
                                  ? step.colors.primary 
                                  : "#334155" // slate-700
                              }}
                            >
                              {step.title}
                            </h4>
                            
                            {/* Arrow indicator for active item */}
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronRight 
                                  className="w-4 h-4"
                                  style={{ color: step.colors.primary }}
                                />
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Expandable description */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p
                                  className="mt-2 text-sm"
                                  style={{ 
                                    color: "#64748b", // slate-500
                                    fontFamily: "NanumSquare" 
                                  }}
                                >
                                  {step.description}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Interactive instruction */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-8 p-3 rounded-lg text-center text-gray-600"
                >
                  <p style={{ fontFamily: "NanumSquareBold" }}>
                    각 단계를 클릭하여 자세한 내용을 확인해보세요
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
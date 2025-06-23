"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarCheck2,
  SearchCheck,
  BotMessageSquare,
  Rocket,
  Star,
  CheckCircle,
  PlusCircle,
  X,
  Users,
  FileText,
  MessageSquare,
  ChevronDown,
  ArrowRight,
} from "lucide-react"
import { useInView } from "react-intersection-observer"

// Enhanced steps data with additional details
const steps = [
  {
    icon: <CalendarCheck2 className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "상담 및 데모 신청",
    description: "궁금한 점을 문의주시면, 1:1 데모와 상담을 통해 무물을 소개해드려요.",
    accent: "#818cf8",
    gradient: "from-indigo-400 to-violet-500",
    details: [
      { icon: <Users size={16} />, text: "전담 컨설턴트 배정" },
      { icon: <MessageSquare size={16} />, text: "1:1 맞춤형 상담 진행" },
      { icon: <FileText size={16} />, text: "무물 솔루션 상세 설명 및 데모" },
    ],
    casestudy: "A 커피숍은 상담을 통해 메뉴와 매장 정보를 챗봇으로 응대하는 방법을 알게 되었습니다.",
  },
  {
    icon: <SearchCheck className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "업종 맞춤 진단",
    description: "업종과 고객 유형에 맞는 챗봇 구성 및 예상 성과를 안내해드려요.",
    accent: "#6366f1",
    gradient: "from-blue-400 to-indigo-500",
    details: [
      { icon: <FileText size={16} />, text: "업종별 맞춤 분석 보고서" },
      { icon: <CheckCircle size={16} />, text: "고객 패턴 및 니즈 파악" },
      { icon: <Star size={16} />, text: "기대 효과 및 ROI 분석" },
    ],
    casestudy: "B 병원은 진료과별 FAQ와 예약 문의가 가장 많다는 진단을 받고 이에 최적화된 솔루션을 도입했습니다.",
  },
  {
    icon: <BotMessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "데이터 연동 및 챗봇 구축",
    description: "FAQ, 문서 등 기존 데이터를 기반으로 맞춤형 챗봇을 구성해요.",
    accent: "#4f46e5",
    gradient: "from-violet-400 to-purple-500",
    details: [
      { icon: <FileText size={16} />, text: "기존 FAQ 및 문서 분석" },
      { icon: <MessageSquare size={16} />, text: "응답 시나리오 설계" },
      { icon: <CheckCircle size={16} />, text: "데이터 최적화 및 학습" },
    ],
    casestudy: "C 공공기관은 기존 민원 데이터 5,000건을 연동해 24시간 민원 응대 챗봇을 구축했습니다.",
  },
  {
    icon: <Rocket className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "테스트 및 서비스 오픈",
    description: "실사용 테스트를 거쳐, 고객 응대에 바로 활용할 수 있도록 런칭해요.",
    accent: "#4338ca",
    gradient: "from-purple-400 to-indigo-600",
    details: [
      { icon: <CheckCircle size={16} />, text: "내부 테스트 및 피드백 반영" },
      { icon: <MessageSquare size={16} />, text: "챗봇 응답 정확도 개선" },
      { icon: <Rocket size={16} />, text: "실시간 모니터링 및 지원" },
    ],
    casestudy: "D 쇼핑몰은 2주간의 테스트 후 고객 문의 응대 시간을 75% 절감했습니다.",
  },
]

const OnboardingProcessSection = () => {
  const [activeStep, setActiveStep] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)
  const stepsContainerRef = useRef(null)

  // Reference for each step
  const stepRefs = useRef([])

  // 섹션 가시성
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // 단계 클릭 시 세부 정보 표시 토글
  const toggleStepDetails = (index) => {
    setSelectedStep((prevSelectedStep) => {
      return prevSelectedStep === index ? null : index
    })
  }

  useEffect(() => {
    if (selectedStep !== null && window.innerWidth < 768) {
      setTimeout(() => {
        stepRefs.current[selectedStep]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 100)
    }
  }, [selectedStep])

  // 호버 상태 관리
  const handleStepHover = (index) => {
    setActiveStep(index)
  }

  const handleStepLeave = () => {
    setActiveStep(null)
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-28 px-4 overflow-hidden relative font-NanumSquareBold"
      style={{
        background: "linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #f0f4ff 100%)",
      }}
    >
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 70%)",
            transform: "translate(20%, -30%)",
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-20 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0) 70%)",
            transform: "translate(-20%, 30%)",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%236366f1' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-16 md:mb-24 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* 장식 요소 */}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-20 hidden md:block"
            style={{
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(99, 102, 241, 0) 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          ></motion.div>

          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-indigo-100 rounded-full mb-4">
            <span className="text-xs sm:text-sm font-medium text-indigo-700">간편한 4단계 프로세스</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-NanumSquareExtraBold text-gray-900 mb-4 sm:mb-6 relative inline-block">
            <span className="relative bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
              무물 도입 절차
            </span>
            <motion.div
              className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-indigo-400 to-violet-500 w-full rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
          </h2>

          <motion.p
            className="text-base sm:text-lg max-w-2xl mx-auto text-gray-600 leading-relaxed font-NanumSquare"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            도입은 어렵지 않아요. <br className="sm:hidden" /> 아래 단계를 따라가면 무물을 바로 시작할 수 있어요!
            <span className="text-indigo-600 text-xs sm:text-sm mt-2 inline-block">
              각 단계를 탭하면 더 자세한 정보를 확인할 수 있어요.
            </span>
          </motion.p>
        </motion.div>

        {/* 타임라인 */}
        <div className="mb-16 md:mb-24 relative" ref={stepsContainerRef}>
          {/* 데스크톱 연결선 */}
          <div className="hidden md:block absolute top-[140px] left-[10%] w-[80%] h-3 transform">
            <div className="w-full h-full bg-gradient-to-r from-indigo-200 via-violet-300 to-purple-400 rounded-full opacity-50"></div>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white"
              style={{ originX: 1 }}
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            ></motion.div>
          </div>

          {/* 모바일 연결선 */}
          <div className="md:hidden absolute left-6 top-10 bottom-10 w-1.5 bg-gradient-to-b from-indigo-200 via-violet-300 to-purple-400 rounded-full opacity-50"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-6 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                ref={(el) => (stepRefs.current[index] = el)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="relative z-10"
                onMouseEnter={() => handleStepHover(index)}
                onMouseLeave={handleStepLeave}
                onClick={() => toggleStepDetails(index)}
              >
                {/* 단계 카드 */}
                <div className="relative h-full group perspective pl-12 md:pl-0">
                  {/* 단계 번호 */}
                  <div
                    className={`absolute -top-3 md:-top-5 -left-1 md:-left-5 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-lg font-bold z-20 transform group-hover:scale-110 transition-transform bg-gradient-to-br ${step.gradient} text-white shadow-lg`}
                    style={{
                      boxShadow: `0 10px 15px -3px ${step.accent}40, 0 4px 6px -4px ${step.accent}30`,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* 데스크톱 연결점 */}
                  <div className="hidden md:block absolute top-[140px] left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-full bg-white border-4 z-20`}
                        style={{ borderColor: step.accent }}
                      ></div>
                      <motion.div
                        className="absolute -top-4 -left-4 w-16 h-16 rounded-full"
                        style={{ backgroundColor: `${step.accent}20` }}
                        animate={{
                          scale: activeStep === index ? [1, 1.3, 1] : 1,
                          opacity: activeStep === index ? [0.5, 0.7, 0.5] : 0.5,
                        }}
                        transition={{
                          repeat: activeStep === index ? Number.POSITIVE_INFINITY : 0,
                          duration: 2,
                        }}
                      ></motion.div>
                    </div>
                  </div>

                  {/* 모바일 연결점 */}
                  <div className="md:hidden absolute top-0 -left-1 z-20">
                    <div
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${step.gradient} shadow-md`}
                      style={{
                        boxShadow: `0 0 0 3px white, 0 5px 10px -3px ${step.accent}40`,
                      }}
                    ></div>
                  </div>

                  {/* 카드 내용 */}
                  <motion.div
                    className={`bg-white rounded-xl md:rounded-2xl h-full transition-all duration-500 overflow-hidden relative backdrop-blur-sm ${
                      selectedStep === index
                        ? "ring-2 ring-indigo-500 shadow-2xl"
                        : "shadow-lg hover:shadow-xl border border-indigo-50"
                    }`}
                    style={{
                      boxShadow:
                        selectedStep === index
                          ? `0 20px 30px -10px ${step.accent}30, 0 10px 20px -10px ${step.accent}20`
                          : `0 10px 20px -5px ${step.accent}10, 0 5px 10px -5px ${step.accent}05`,
                      transform: `perspective(1000px) ${
                        activeStep === index ? "rotateY(5deg) rotateX(2deg)" : "rotateY(0) rotateX(0)"
                      }`,
                    }}
                    whileHover={{
                      boxShadow: `0 20px 30px -10px ${step.accent}30, 0 10px 20px -10px ${step.accent}20`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    {/* 카드 상단 그라데이션 */}
                    <div
                      className={`h-2 w-full bg-gradient-to-r ${step.gradient}`}
                      style={{
                        boxShadow: `0 3px 10px -3px ${step.accent}50`,
                      }}
                    ></div>

                    <div className="p-5 sm:p-8">
                      <div className="flex flex-col items-center text-center relative">
                        {/* 아이콘 */}
                        <motion.div
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 relative shadow-lg bg-gradient-to-br from-white to-indigo-50`}
                          style={{ color: step.accent }}
                          whileHover={{
                            scale: 1.05,
                            rotate: 5,
                          }}
                        >
                          <div
                            className="absolute inset-0 rounded-2xl opacity-10"
                            style={{
                              background: `linear-gradient(135deg, ${step.accent}40, ${step.accent}10)`,
                            }}
                          ></div>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                            }}
                          >
                            {step.icon}
                          </motion.div>
                        </motion.div>

                        {/* 제목 */}
                        <h3
                          className={`font-bold text-lg sm:text-xl mb-3 sm:mb-4 relative group-hover:text-indigo-700 transition-colors`}
                          style={{ color: step.accent }}
                        >
                          {step.title}
                        </h3>

                        {/* 설명 */}
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>

                        {/* 상세 정보 버튼 */}
                        <motion.button
                          className={`mt-5 mb-2 sm:mt-6 sm:mb-3 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                            selectedStep === index
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          aria-expanded={selectedStep === index}
                          aria-controls={`step-details-${index}`}
                        >
                          <span>{selectedStep === index ? "상세 정보 닫기" : "상세 정보 보기"}</span>
                          <motion.div
                            animate={{ rotate: selectedStep === index ? 45 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {selectedStep === index ? (
                              <X size={14} className="sm:w-4 sm:h-4" />
                            ) : (
                              <PlusCircle size={14} className="sm:w-4 sm:h-4" />
                            )}
                          </motion.div>
                        </motion.button>

                        {/* 확장된 상세 정보 */}
                        <AnimatePresence>
                          {selectedStep === index && (
                            <motion.div
                              id={`step-details-${index}`}
                              className="w-full"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="border-t border-indigo-100 w-full pt-4 mt-2">
                                <div className="flex flex-col items-start text-left mb-4">
                                  <ul className="space-y-3 w-full">
                                    {step.details.map((detail, idx) => (
                                      <motion.li
                                        key={idx}
                                        className="flex items-start gap-3"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.2 }}
                                      >
                                        <div
                                          className="p-1.5 rounded-full flex-shrink-0 mt-0.5"
                                          style={{ backgroundColor: `${step.accent}15` }}
                                        >
                                          <div className="text-indigo-600">{detail.icon}</div>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-700">{detail.text}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>

                                {/* 사례 연구 정보 */}
                                <motion.div
                                  className="w-full rounded-lg mt-2 overflow-hidden"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <div
                                    className={`p-3 sm:p-4 relative`}
                                    style={{ backgroundColor: `${step.accent}10` }}
                                  >
                                    <div
                                      className="absolute top-0 left-0 w-1.5 h-full"
                                      style={{ backgroundColor: step.accent }}
                                    ></div>
                                    <p className="text-xs sm:text-sm pl-2 text-gray-700">
                                      <span className="font-semibold" style={{ color: step.accent }}>
                                        사례:
                                      </span>{" "}
                                      {step.casestudy}
                                    </p>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>

                  {/* 모바일 연결 표시 */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden absolute -bottom-8 left-[2px] transform -translate-x-1/2">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        <ChevronDown className="w-4 h-4" style={{ color: step.accent }} />
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA 섹션 */}
        <motion.div
          className="text-center max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-50 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {/* 배경 장식 */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.8) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.8) 0%, transparent 40%)",
            }}
          ></div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">지금 바로 무물과 함께 시작하세요</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto">
            무물의 AI 챗봇으로 고객 응대를 자동화하고 비즈니스 효율성을 높여보세요. 간단한 상담 신청으로 맞춤형 솔루션을
            경험해보세요.
          </p>
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-lg"
            style={{
              boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 5px 10px -5px rgba(99, 102, 241, 0.3)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 30px -5px rgba(99, 102, 241, 0.6), 0 10px 15px -5px rgba(99, 102, 241, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>무료 상담 신청하기</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default OnboardingProcessSection

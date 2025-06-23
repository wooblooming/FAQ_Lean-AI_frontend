"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Store,
  Landmark,
  ArrowRight,
  Zap,
  Shield,
  BarChart,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import StoreTab from "./StoreTab";
import CorpTab from "./CorpTab";
import PublicTab from "./PublicTab";

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("store");
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // 섹션 가시성
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });
  // 제목 가시성
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 탭별 색상 데이터
  const tabColors = {
    store: {
      primary: "#F59E0B",
      secondary: "#FBBF24",
      light: "#FEF3C7",
      dark: "#92400E",
      icon: Store,
      label: "소상공인용",
      description: "소규모 비즈니스를 위한 \nAI 응대 솔루션",
    },
    corp: {
      primary: "#10B981",
      secondary: "#34D399",
      light: "#D1FAE5",
      dark: "#166534",
      icon: Building,
      label: "기업용",
      description: "대기업을 위한 확장 가능한 \nAI 응대 플랫폼",
    },
    public: {
      primary: "#0EA5E9",
      secondary: "#38BDF8",
      light: "#E0F2FE",
      dark: "#075985",
      icon: Landmark,
      label: "공공기관용",
      description: "공공 서비스를 위한 특화된 \nAI 솔루션",
    },
  };

  const activeData = tabColors[activeTab];

  // 스크롤 이벤트로 scrollY 업데이트
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24 overflow-hidden relative"
      style={{
        background: `radial-gradient(circle at 70% 50%, ${activeData.light}44, transparent 70%), 
                    radial-gradient(circle at 30% 80%, ${activeData.light}33, transparent 50%)`,
      }}
    >
      {/* 3D 효과를 위한 배경 그리드 */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${activeData.dark}22 1px, transparent 1px), 
                           linear-gradient(90deg, ${activeData.dark}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          perspective: "1000px",
          transform: `rotateX(60deg) translateY(-20%) scale(2) translateZ(0px)`,
          backgroundPosition: "center",
          transformOrigin: "center center",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 섹션 헤더 */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full mb-3"
            style={{ backgroundColor: `${activeData.light}77` }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: activeData.primary }}
            >
              AI 기반 고객 응대
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold inline-block mb-3 md:mb-6 relative"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            무물에서는 무엇을 할 수 있을까요?!
            <motion.div
              className="absolute -bottom-3 left-0 h-2 rounded-full"
              style={{
                backgroundColor: activeData.primary,
                width: "100%",
                opacity: 0.2,
              }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg max-w-2xl mx-auto mt-6"
            style={{ fontFamily: "NanumSquare", color: "#444" }}
          >
            고객 질문에 최적화된 AI 기반 <br className="sm:hidden"/>응대 솔루션으로 업무 효율성을
            높여보세요
          </motion.p>
        </motion.div>

        {/* 3D 탭 인터페이스 */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          {/* 모바일 탭 또는 데스크톱 탭 */}
          {isMobile ? (
            // 모바일 최적화 탭 UI
            <div className="mb-6 relative">
              <div className="rounded-2xl p-1.5 mb-8 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="relative flex items-center">
                  {/* 활성 탭 배경 */}
                  <motion.div 
                    className="absolute h-full rounded-xl"
                    layoutId="tabBackground"
                    style={{ 
                      background: `linear-gradient(to right, ${activeData.light}80, ${activeData.light})`,
                      width: '33.333%',
                      left: activeTab === "store" ? '0%' : activeTab === "corp" ? '33.333%' : '66.666%'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  
                  {/* 탭 버튼들 */}
                  {Object.keys(tabColors).map((tabId) => {
                    const tabData = tabColors[tabId];
                    const isActive = activeTab === tabId;
                    const Icon = tabData.icon;

                    return (
                      <motion.button
                        key={tabId}
                        onClick={() => setActiveTab(tabId)}
                        className={`relative z-10 flex-1 py-2.5 rounded-lg flex flex-col items-center justify-center`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className={`mb-1 rounded-full p-1.5 ${isActive ? 'bg-white' : 'bg-transparent'}`}
                          style={{
                            color: isActive ? tabData.primary : '#777',
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-xs font-bold transition-colors duration-200`}
                          style={{
                            fontFamily: "NanumSquareExtraBold",
                            color: isActive ? tabData.dark : '#666',
                          }}
                        >
                          {tabData.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* 모바일 탭 콘텐츠 카드 */}
              <motion.div
                className="relative bg-white rounded-xl shadow-xl p-5 overflow-hidden border-2"
                style={{ borderColor: activeData.primary }}
                animate={{
                  boxShadow: `0 15px 30px -10px ${activeData.primary}22, 0 5px 15px -5px ${activeData.primary}33`,
                }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-panel-mobile`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >

                    {/* 탭 컨텐츠 렌더링 */}
                    <div>
                      {activeTab === "store" && <StoreTab />}
                      {activeTab === "corp" && <CorpTab />}
                      {activeTab === "public" && <PublicTab />}
                    </div>
                    
                    {/* CTA 버튼 */}
                    <div className="mt-6 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg"
                        style={{
                          background: `linear-gradient(to right, ${activeData.primary}, ${activeData.secondary})`,
                          color: "white",
                        }}
                      >
                        <span className="text-sm font-bold">자세히 알아보기</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          ) : (
            // 데스크탑 탭 UI
            <div>
              <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 relative">
                {/* 탭 버튼들 */}
                {Object.keys(tabColors).map((tabId) => {
                  const tabData = tabColors[tabId];
                  const isActive = activeTab === tabId;
                  const Icon = tabData.icon;

                  return (
                    <motion.div
                      key={tabId}
                      onClick={() => setActiveTab(tabId)}
                      className="cursor-pointer relative"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        delay:
                          tabId === "store" ? 0.1 : tabId === "corp" ? 0.2 : 0.3,
                      }}
                    >
                      <motion.div
                        className={`
                          relative z-10 rounded-xl overflow-hidden shadow-lg 
                          border-2 p-4 flex flex-col items-center justify-center
                          transition-transform duration-300 h-28 sm:h-32
                          ${isActive ? "scale-105" : "scale-100"}
                        `}
                        style={{
                          backgroundColor: isActive
                            ? "white"
                            : `${tabData.light}88`,
                          borderColor: isActive ? tabData.primary : "transparent",
                          transform: isActive
                            ? "translateZ(10px)"
                            : `translateZ(0px) ${
                                tabId === "store"
                                  ? "perspective(1000px) rotateY(-5deg)"
                                  : tabId === "public"
                                  ? "perspective(1000px) rotateY(5deg)"
                                  : ""
                              }`,
                        }}
                        whileHover={{
                          backgroundColor: "white",
                          scale: 1.05,
                          y: -5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div
                          className="p-2 rounded-full mb-2"
                          style={{
                            backgroundColor: isActive ? tabData.light : "white",
                            color: tabData.primary,
                          }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3
                          className="text-center text-sm sm:text-base font-bold"
                          style={{
                            fontFamily: "NanumSquareExtraBold",
                            color: isActive ? tabData.dark : "#444",
                          }}
                        >
                          {tabData.label}
                        </h3>
                      </motion.div>

                      {/* 활성화 표시기 */}
                      {isActive && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 rotate-45 bg-white border-2 z-0"
                          style={{ borderColor: tabData.primary }}
                          transition={{ duration: 0.3, type: "spring" }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* 탭 콘텐츠 패널 */}
              <motion.div
                className="relative bg-white rounded-xl shadow-xl p-6 sm:p-8 overflow-hidden border-2"
                style={{ borderColor: activeData.primary }}
                animate={{
                  boxShadow: `0 15px 30px -10px ${activeData.primary}22, 0 5px 15px -5px ${activeData.primary}33`,
                }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-panel`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative min-h-[300px]"
                  >

                    {/* 탭 컨텐츠 렌더링 */}
                    <div>
                      {activeTab === "store" && <StoreTab />}
                      {activeTab === "corp" && <CorpTab />}
                      {activeTab === "public" && <PublicTab />}
                    </div>
                    
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
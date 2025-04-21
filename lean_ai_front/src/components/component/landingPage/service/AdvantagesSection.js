"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Building,
  Store,
  Landmark,
  Check,
} from "lucide-react";

// Enhanced data structure with more design elements
const advantagesData = [
  {
    id: "small-business",
    title: "소상공인을 위한 무물",
    icon: Store,
    colors: {
      primary: "#F59E0B",
      secondary: "#FBBF24",
      light: "#FEF3C7",
      dark: "#92400E",
      ultraDark: "#854D0E",
      gradientFrom: "#FCD34D",
      gradientTo: "#F59E0B",
    },
    points: [
      "1인 매장·소규모 매장 최적화",
      "자주 묻는 질문 자동 대응으로 인건비 절감",
      "운영 중 고객 문의 대응 시간 감소",
      "QR 코드 기반 챗봇 접점 제공으로 고객 접근성 향상",
      "반복 질문을 AI가 응대하여 사장님은 매장 운영에 집중",
      "정기 구독 기반으로 저렴한 비용으로 지속 이용 가능",
    ],
  },
  {
    id: "enterprise",
    title: "기업을 위한 무물",
    icon: Building,
    colors: {
      primary: "#10B981",
      secondary: "#34D399",
      light: "#D1FAE5",
      dark: "#166534",
      ultraDark: "#166534",
      gradientFrom: "#6EE7B7",
      gradientTo: "#10B981",
    },
    points: [
      "CS 챗봇으로 상담 인력 리소스 절약",
      "RAG 기반 답변으로 복잡한 질문에도 높은 정확도 제공",
      "사내 지식 검색 자동화로 내부 문의 대응 부담 감소",
      "법률/지침/사내 문서도 자연어 검색 가능",
      "챗봇 대화 통계 기반 VOC 인사이트 확보 가능 (예정)",
    ],
  },
  {
    id: "public",
    title: "공공기관을 위한 무물",
    icon: Landmark,
    colors: {
      primary: "#0EA5E9",
      secondary: "#38BDF8",
      light: "#E0F2FE",
      dark: "#075985",
      ultraDark: "#075985",
      gradientFrom: "#38BDF8",
      gradientTo: "#0EA5E9",
    },
    points: [
      "자주 접수되는 민원 자동 응답으로 처리 속도 향상",
      "민원 접수 → 답변까지 백오피스 UI로 통합 관리",
      "행정 서식 및 법령 검색 자동화로 직원 편의성 향상",
      "기관 담당자 맞춤형 응답 기능 제공",
      "반복적인 민원 응대에 따른 직원 감정소모 완화",
    ],
  },
];

export default function AdvantagesSection() {
  const [activeTab, setActiveTab] = useState("small-business");
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Get active data
  const activeData = advantagesData.find((item) => item.id === activeTab);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Autoplay functionality with pause on hover
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      const currentIndex = advantagesData.findIndex(
        (item) => item.id === activeTab
      );
      const nextIndex = (currentIndex + 1) % advantagesData.length;
      setActiveTab(advantagesData[nextIndex].id);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeTab, isAutoplay]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 overflow-hidden relative"
      style={{
        background: `radial-gradient(circle at 10% 10%, ${activeData.colors.light}44, transparent 50%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Dynamic blob shapes */}
            <div
              className="absolute rounded-full filter blur-3xl opacity-20"
              style={{
                width: "60vw",
                height: "60vw",
                right: "-20vw",
                top: "-20vw",
                background: `linear-gradient(135deg, ${activeData.colors.primary}99, ${activeData.colors.primary}22)`,
                transform: `rotate(${scrollY * 0.02}deg) translateY(${
                  scrollY * 0.1
                }px)`,
              }}
            />
            <div
              className="absolute rounded-full filter blur-3xl opacity-10"
              style={{
                width: "40vw",
                height: "40vw",
                left: "-10vw",
                bottom: "-10vw",
                background: `linear-gradient(135deg, ${activeData.colors.secondary}99, ${activeData.colors.primary}22)`,
                transform: `rotate(${-scrollY * 0.02}deg) translateY(${
                  -scrollY * 0.05
                }px)`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Animated Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 relative inline-block"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            <motion.span
              initial={false}
              animate={{ backgroundColor: activeData.colors.primary }}
              transition={{ duration: 0.4 }}
              className="relative z-10 px-8 py-3 rounded-full"
              style={{ color: '#ffffff' }}
            >
              무물을 선택해야 하는 이유
            </motion.span>
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto mt-6 text-gray-600"
            style={{ fontFamily: "NanumSquare" }}
          >
            다양한 업종에 맞춰 무물이 어떤 가치를 제공하는지 확인해보세요.
          </p>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {advantagesData.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                className="flex items-center gap-3 py-3.5 px-6 rounded-full transition-all relative overflow-hidden"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsAutoplay(false);
                }}
                onMouseEnter={() => setIsAutoplay(false)}
                initial={false}
                animate={{
                  backgroundColor: isActive ? item.colors.primary : "white",
                  color: isActive ? "white" : item.colors.dark,
                  boxShadow: isActive
                    ? `0 10px 25px -5px ${item.colors.primary}33, 0 8px 10px -6px ${item.colors.primary}22`
                    : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  backgroundColor: isActive
                    ? item.colors.primary
                    : item.colors.light,
                  y: -3,
                  boxShadow: `0 15px 30px -5px ${item.colors.primary}33, 0 10px 10px -5px ${item.colors.primary}22`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`relative p-2 rounded-full ${
                    isActive
                      ? "bg-white bg-opacity-20"
                      : `bg-${
                          item.id === "small-business"
                            ? "amber"
                            : item.id === "enterprise"
                            ? "emerald"
                            : "sky"
                        }-100`
                  }`}
                >
                  <ItemIcon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : `text-${item.colors.dark}`
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="tabIconRing"
                      className="absolute inset-0 rounded-full border-2 border-white border-opacity-70"
                      transition={{ duration: 0.3, type: "spring" }}
                    />
                  )}
                </div>

                <span
                  className="font-semibold"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  {item.title}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute right-3 top-0 bottom-0 flex items-center"
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Content Area with AnimatePresence for smooth transitions */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <TabContent
                data={activeData}
                hoverPoint={hoverPoint}
                setHoverPoint={setHoverPoint}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// Enhanced TabContent component with more sophisticated animations
function TabContent({ data, hoverPoint, setHoverPoint }) {
  const Icon = data.icon;
  const featureRefs = useRef([]);
  const iconRef = useRef(null);
  const isIconInView = useInView(iconRef, { once: true, amount: 0.5 });

  // Create staggered animation for features list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
      {/* Left Content - Icon and Title with enhanced animations */}
      <div className="md:col-span-4 flex flex-col items-center md:items-start justify-start">
        {/* 3D-like animated icon */}
        <div ref={iconRef} className="relative mb-8 perspective">
          <motion.div
            className="absolute -z-10 top-8 left-8 w-20 h-20 rounded-2xl opacity-20"
            style={{ backgroundColor: data.colors.primary }}
            animate={{
              rotate: [0, 15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <motion.div
            initial={{ scale: 0.9, rotateY: -15 }}
            animate={
              isIconInView
                ? {
                    scale: 1,
                    rotateY: 0,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    },
                  }
                : {}
            }
            whileHover={{
              scale: 1.05,
              rotateY: 10,
              boxShadow: `0 20px 30px -10px ${data.colors.primary}66`,
            }}
            className="w-36 h-36 rounded-2xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm transform-gpu"
            style={{
              background: `linear-gradient(135deg, ${data.colors.gradientFrom}, ${data.colors.gradientTo})`,
              boxShadow: `0 15px 30px -15px ${data.colors.primary}99`,
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                filter: [
                  "drop-shadow(0 0 0px rgba(255,255,255,0.3))",
                  "drop-shadow(0 0 10px rgba(255,255,255,0.7))",
                  "drop-shadow(0 0 0px rgba(255,255,255,0.3))",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Icon className="w-16 h-16 text-white relative z-10" />
            </motion.div>
          </motion.div>
        </div>

        {/* Title and description with animations */}
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold mb-4 text-center md:text-left"
          style={{
            fontFamily: "NanumSquareExtraBold",
            color: data.colors.ultraDark,
          }}
        >
          {data.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600 mb-6 text-center md:text-left"
        >
          맞춤형 기능으로 최적의 솔루션을 제공합니다
        </motion.p>
      </div>

      {/* Right Content - Features List with glass morphism and staggered animations */}
      <motion.div
        className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {data.points.map((point, idx) => (
          <motion.div
            key={idx}
            ref={(el) => (featureRefs.current[idx] = el)}
            variants={item}
            whileHover={{
              y: -5,
              boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01), 0 0 0 1px ${data.colors.primary}22`,
              backgroundColor: `rgba(255, 255, 255, 0.9)`,
            }}
            onHoverStart={() => setHoverPoint(idx)}
            onHoverEnd={() => setHoverPoint(null)}
            className="p-6 rounded-xl relative bg-white bg-opacity-70 backdrop-blur-sm shadow-sm border border-white border-opacity-70 transition-all duration-300"
            style={{
              boxShadow:
                hoverPoint === idx
                  ? `0 15px 30px -5px ${data.colors.primary}22, 0 0 0 1px ${data.colors.primary}33`
                  : "",
            }}
          >
            <div className="flex items-start gap-4">
              {/* Animated check icon */}
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `linear-gradient(135deg, ${data.colors.gradientFrom}, ${data.colors.gradientTo})`,
                  boxShadow:
                    hoverPoint === idx
                      ? `0 0 15px ${data.colors.primary}66`
                      : `0 0 0px transparent`,
                }}
                animate={{
                  scale: hoverPoint === idx ? [1, 1.2, 1.1] : 1,
                  rotate: hoverPoint === idx ? [0, 10, 0] : 0,
                }}
                transition={{
                  duration: 0.4,
                  type: hoverPoint === idx ? "spring" : "tween",
                  stiffness: 300,
                  damping: 10,
                }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>

              <span
                className="text-gray-800 text-lg"
                style={{ fontFamily: "NanumSquare" }}
              >
                {point}
              </span>
            </div>

            {/* Enhanced highlight effect for hovered item */}
            <AnimatePresence>
              {hoverPoint === idx && (
                <motion.div
                  layoutId="featureHighlight"
                  className="absolute inset-0 rounded-xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 0.08,
                    background: `linear-gradient(135deg, ${data.colors.primary}50, ${data.colors.secondary}30)`,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

const BenefitList = ({
  isMobile: propIsMobile,
  title,
  description,
  benefits,
  colors,
  icon: IconComponent,
}) => {
  // 실제 디바이스 크기 기반 모바일 감지
  const [isMobile, setIsMobile] = useState(propIsMobile);
  const [activeItem, setActiveItem] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 뷰포트 감지
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [iconRef, iconInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  // 화면 크기 감지
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768 || propIsMobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [propIsMobile]);

  // 애니메이션 변수
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

  // 항목 클릭 핸들러 (모바일용)
  const handleItemClick = (index) => {
    if (isMobile) {
      setActiveItem(activeItem === index ? null : index);
    }
  };

  // 모바일 디자인
  if (isMobile) {
    return (
      <div className="rounded-xl overflow-hidden" ref={contentRef}>
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={contentInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="p-5 sm:p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.light}80, white)`,
            borderTop: `1px solid ${colors.primary}22`,
            borderLeft: `1px solid ${colors.primary}22`,
            borderRight: `1px solid ${colors.primary}22`,
            borderBottom: `3px solid ${colors.primary}`,
            boxShadow: `0 10px 25px -5px ${colors.primary}22, 0 8px 10px -6px ${colors.primary}11`,
          }}
        >
          {/* 배경 장식 */}
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
              transform: "translate(30%, -30%)",
            }}
          />

          <div className="relative z-10">
            {/* 아이콘 및 제목 섹션 */}
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={contentInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-3 rounded-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                  boxShadow: `0 8px 15px -5px ${colors.primary}66`,
                }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </motion.div>

              <div>
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={contentInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-lg sm:text-xl font-bold"
                  style={{
                    fontFamily: "NanumSquareExtraBold",
                    color: colors.dark,
                  }}
                >
                  {title}
                </motion.h3>
              </div>
            </div>

            {/* 설명 텍스트 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm mb-5 pr-4"
              style={{ fontFamily: "NanumSquare", color: colors.dark }}
            >
              {description}
            </motion.p>

            {/* 더보기 버튼 */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-medium mb-2 py-1 px-3 rounded-full text-white"
              style={{
                backgroundColor: `${colors.primary}70`,
              }}
            >
              {isExpanded ? "간략히 보기" : "모두 보기"}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* 이점 목록 섹션 */}
        <motion.div
          animate={{
            height: isExpanded ? "auto" : "180px",
            opacity: 1,
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative overflow-hidden bg-white p-4 sm:p-5 border border-gray-100 rounded-b-xl`}
        >
          <div className={`${!isExpanded ? "mask-gradient" : ""}`}>
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-3"
            >
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  variants={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(index)}
                  className={`relative flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                    activeItem === index ? "bg-gray-50" : ""
                  }`}
                  style={{
                    boxShadow:
                      activeItem === index
                        ? `0 2px 10px -2px ${colors.primary}33`
                        : "none",
                    borderLeft:
                      activeItem === index
                        ? `2px solid ${colors.primary}`
                        : "2px solid transparent",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: activeItem === index ? [0, 10, 0] : 0,
                      scale: activeItem === index ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{
                      color: colors.primary,
                      backgroundColor:
                        activeItem === index
                          ? `${colors.light}`
                          : "transparent",
                    }}
                  >
                    <CheckCircle2
                      className="w-5 h-5"
                      fill={activeItem === index ? colors.light : "transparent"}
                    />
                  </motion.div>

                  <div className="flex-1">
                    <span
                      className="text-sm sm:text-base block"
                      style={{ color: colors.dark, fontFamily: "NanumSquare" }}
                    >
                      {benefit}
                    </span>
                  </div>

                  {activeItem === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-0 right-0 w-3 h-3 rounded-full"
                      style={{
                        background: colors.primary,
                        transform: "translate(50%, -50%)",
                      }}
                    />
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* 그라데이션 마스크 효과 (확장되지 않은 경우) */}
          {!isExpanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background: "linear-gradient(to top, white, transparent)",
              }}
            />
          )}
        </motion.div>

        {/* CSS 스타일 */}
        <style jsx global>{`
          .mask-gradient {
            mask-image: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 1) 60%,
              rgba(0, 0, 0, 0)
            );
            -webkit-mask-image: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 1) 60%,
              rgba(0, 0, 0, 0)
            );
          }
        `}</style>
      </div>
    );
  }

  // 데스크톱 디자인 (원래 코드 유지)
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
      {/* 왼쪽 아이콘 영역 */}
      <div className="md:col-span-4 flex flex-col items-center md:items-start justify-start">
        <div ref={iconRef} className="relative mb-8 perspective">
          <motion.div
            className="absolute -z-10 top-8 left-8 w-20 h-20 rounded-2xl opacity-20"
            style={{ backgroundColor: colors.primary }}
            animate={{ rotate: [0, 15, 0], scale: [1, 1.05, 1] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <motion.div
            initial={{ scale: 0.9, rotateY: -15 }}
            animate={
              iconInView
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
              boxShadow: `0 20px 30px -10px ${colors.primary}66`,
            }}
            className="w-36 h-36 rounded-2xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm transform-gpu"
            style={{
              background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
              boxShadow: `0 15px 30px -15px ${colors.primary}99`,
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
              <IconComponent className="w-16 h-16 text-white relative z-10" />
            </motion.div>
          </motion.div>
        </div>

        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold mb-4 text-center md:text-left"
          style={{
            fontFamily: "NanumSquareExtraBold",
            color: colors.ultraDark,
          }}
        >
          {title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600 mb-6 text-center md:text-left"
        >
          {description}
        </motion.p>
      </div>

      {/* 오른쪽 이점 리스트 */}
      <motion.div
        className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {benefits.map((point, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{
              y: -5,
              boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01), 0 0 0 1px ${colors.primary}22`,
              backgroundColor: `rgba(255, 255, 255, 0.9)`,
            }}
            onHoverStart={() => setActiveItem(idx)}
            onHoverEnd={() => setActiveItem(null)}
            className="p-6 rounded-xl relative bg-opacity-70 backdrop-blur-sm shadow-sm border transition-all duration-300"
            style={{
              borderColor: `${colors.light}`,
              boxShadow:
                activeItem === idx
                  ? `0 15px 30px -5px ${colors.primary}22, 0 0 0 1px ${colors.primary}33`
                  : "",
            }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                  boxShadow:
                    activeItem === idx
                      ? `0 0 15px ${colors.primary}66`
                      : `0 0 0px transparent`,
                }}
                animate={{
                  scale: activeItem === idx ? [1, 1.2, 1.1] : 1,
                  rotate: activeItem === idx ? [0, 10, 0] : 0,
                }}
                transition={{
                  duration: 0.4,
                  type: activeItem === idx ? "spring" : "tween",
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

            <AnimatePresence>
              {activeItem === idx && (
                <motion.div
                  layoutId="featureHighlight"
                  className="absolute inset-0 rounded-xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 0.08,
                    background: `linear-gradient(135deg, ${colors.primary}50, ${colors.secondary}30)`,
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
};

export default BenefitList;

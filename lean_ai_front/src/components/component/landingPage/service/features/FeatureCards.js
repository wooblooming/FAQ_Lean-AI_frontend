"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FeatureCards = ({ features, colorScheme, title }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // 색상 매핑 객체
  const colorMap = {
    amber: {
      title: 'text-yellow-700',
      iconBg: 'bg-amber-50',
      iconHoverBg: 'bg-amber-100',
      iconColor: 'text-amber-400',
      iconHoverColor: 'text-amber-600',
      cardAccent: 'from-amber-500 to-amber-400',
      titleColor: 'text-amber-800',
      shadowBase: 'rgba(251, 191, 36, 0.12)',
      shadowHover: 'rgba(251, 191, 36, 0.28)',
      accent: 'amber-500'
    },
    emerald: {
      title: 'text-emerald-700',
      iconBg: 'bg-emerald-50',
      iconHoverBg: 'bg-emerald-100',
      iconColor: 'text-emerald-400',
      iconHoverColor: 'text-emerald-600',
      cardAccent: 'from-emerald-500 to-emerald-400',
      titleColor: 'text-emerald-800',
      shadowBase: 'rgba(16, 185, 129, 0.12)',
      shadowHover: 'rgba(16, 185, 129, 0.28)',
      accent: 'emerald-500'
    },
    sky: {
      title: 'text-sky-700',
      iconBg: 'bg-sky-50',
      iconHoverBg: 'bg-sky-100',
      iconColor: 'text-sky-400',
      iconHoverColor: 'text-sky-600',
      cardAccent: 'from-sky-500 to-sky-400',
      titleColor: 'text-sky-800',
      shadowBase: 'rgba(14, 165, 233, 0.12)',
      shadowHover: 'rgba(14, 165, 233, 0.28)',
      accent: 'sky-500'
    },
    indigo: {
      title: 'text-indigo-700',
      iconBg: 'bg-indigo-50',
      iconHoverBg: 'bg-indigo-100',
      iconColor: 'text-indigo-400',
      iconHoverColor: 'text-indigo-600',
      cardAccent: 'from-indigo-500 to-indigo-400',
      titleColor: 'text-indigo-800',
      shadowBase: 'rgba(99, 102, 241, 0.12)',
      shadowHover: 'rgba(99, 102, 241, 0.28)',
      accent: 'indigo-500'
    }
  };
  
  // 현재 색상 스키마 설정
  const colors = colorMap[colorScheme] || colorMap.indigo;

  // 카드 스타일 함수
  const getCardStyle = (index) => {
    const isHovered = hoveredIndex === index;
    return {
      boxShadow: isHovered 
        ? `0 20px 30px -10px ${colors.shadowHover}, 0 10px 15px -5px rgba(0, 0, 0, 0.04), 0 2px 0 0 ${colors.shadowHover}`
        : `0 10px 20px -5px ${colors.shadowBase}, 0 5px 10px -7px rgba(0, 0, 0, 0.03)`,
      transition: 'all 0.3s ease',
      borderTop: isHovered ? `4px solid ${colors.accent}` : '4px solid transparent',
      background: isHovered 
        ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))' 
        : 'white'
    };
  };

  return (
    <motion.div
      ref={featuresRef}
      initial={{ opacity: 0, y: 20 }}
      animate={featuresInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="mb-20 relative w-full"
    >
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className={`absolute top-10 left-10 w-64 h-64 rounded-full bg-${colorScheme}-200 filter blur-3xl opacity-40`}></div>
        <div className={`absolute bottom-10 right-20 w-72 h-72 rounded-full bg-${colorScheme}-100 filter blur-3xl opacity-30`}></div>
      </div>
      
      {/* 섹션 제목 */}
      <div className="text-center mb-16 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={featuresInView ? { width: "100%" } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className={`absolute h-1 bg-gradient-to-r from-${colorScheme}-400 to-${colorScheme}-300 left-0 right-0 mx-auto bottom-0 max-w-md rounded-full opacity-60`}
        />
        
        <h3
          className={`text-2xl md:text-3xl font-bold relative inline-block pb-4 ${colors.title}`}
          style={{ fontFamily: "NanumSquareExtraBold" }}
        >
          {title}
        </h3>
      </div>

      {/* 기능 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="relative rounded-xl border border-gray-100 px-5 py-6 group"
            style={getCardStyle(index)}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.5, 
                delay: 0.1 * index 
              }
            } : {}}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            {/* 카드 상단 그라데이션 장식 */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div 
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.cardAccent} rounded-t-xl -mt-px`}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
            
            {/* 아이콘 영역 */}
            <div className="mb-6 relative">
              <motion.div 
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  hoveredIndex === index ? colors.iconHoverBg : colors.iconBg
                } transition-colors duration-300 relative z-10`}
                animate={hoveredIndex === index ? { 
                  scale: 1.05,
                  transition: { 
                    duration: 0.2,
                    repeat: 0
                  }
                } : { scale: 1 }}
              >
                <feature.icon className={`w-8 h-8 ${
                  hoveredIndex === index ? colors.iconHoverColor : colors.iconColor
                } transition-colors duration-300`} />
              </motion.div>
              
              {/* 아이콘 배경 효과 */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div 
                    className={`absolute top-2 left-2 w-12 h-12 bg-${colorScheme}-400 rounded-full opacity-10 -z-0`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* 제목 */}
            <motion.h4
              className={`text-xl font-bold mb-3 ${colors.titleColor} group-hover:translate-x-0.5`}
              style={{ fontFamily: "NanumSquareExtraBold", transition: "transform 0.2s ease" }}
            >
              {feature.title}
            </motion.h4>
            
            {/* 설명 */}
            <p
              className="text-gray-600 leading-relaxed"
              style={{ fontFamily: "NanumSquare" }}
            >
              {feature.description}
            </p>
            
            {/* 카드 호버 효과 - 오른쪽 하단 장식 */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div 
                  className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-${colorScheme}-100 to-transparent rounded-bl-xl rounded-tr-xl opacity-70`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeatureCards;
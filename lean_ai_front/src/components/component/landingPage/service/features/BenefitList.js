"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check } from "lucide-react";

const BenefitList = ({ 
  title, 
  description, 
  benefits, 
  colors, 
  icon: IconComponent 
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  
  const [iconRef, iconInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

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
      {/* 왼쪽 아이콘 영역 */}
      <div className="md:col-span-4 flex flex-col items-center md:items-start justify-start">
        {/* 3D-like animated icon */}
        <div ref={iconRef} className="relative mb-8 perspective">
          <motion.div
            className="absolute -z-10 top-8 left-8 w-20 h-20 rounded-2xl opacity-20"
            style={{ backgroundColor: colors.primary }}
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

        {/* Title and description with animations */}
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
            onHoverStart={() => setHoveredPointIndex(idx)}
            onHoverEnd={() => setHoveredPointIndex(null)}
           className="p-6 rounded-xl relative bg-opacity-70 backdrop-blur-sm shadow-sm border transition-all duration-300"
            style={{
              borderColor: `${colors.light}`,
              boxShadow:
                hoveredPointIndex === idx
                  ? `0 15px 30px -5px ${colors.primary}22, 0 0 0 1px ${colors.primary}33`
                  : "",
            }}
          >
            <div className="flex items-start gap-4">
              {/* Animated check icon */}
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                  boxShadow:
                    hoveredPointIndex === idx
                      ? `0 0 15px ${colors.primary}66`
                      : `0 0 0px transparent`,
                }}
                animate={{
                  scale: hoveredPointIndex === idx ? [1, 1.2, 1.1] : 1,
                  rotate: hoveredPointIndex === idx ? [0, 10, 0] : 0,
                }}
                transition={{
                  duration: 0.4,
                  type: hoveredPointIndex === idx ? "spring" : "tween",
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
              {hoveredPointIndex === idx && (
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
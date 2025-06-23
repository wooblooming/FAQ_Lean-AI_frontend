"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

export default function HeroMumulSection() {
  // Component mount state
  const [mounted, setMounted] = useState(false);
  // Animation controllers
  const circleControls = useAnimation();
  const flare1Controls = useAnimation();
  const flare2Controls = useAnimation();
  const circleRingControls = useAnimation();

  // Cursor ref for typing animation
  const cursorRef = useRef(null);
  const [displayText, setDisplayText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const typingSpeed = 50;

  // Mouse position for interactive effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Typing effect for descriptions
  const descriptions = [
    "복잡한 질문도 정확하게 답변!",
    "24시간 AI 챗봇으로 자주 묻는 질문을 자동 응답!",
    "고객 만족도는 올리고, CS 부담은 줄여보세요.",
  ];

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Mark component as mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Typing animation effect
  useEffect(() => {
    let timeout;
    const currentFullText = descriptions[currentTextIndex];

    if (isTyping) {
      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, displayText.length - 1));
        }, typingSpeed / 2);
      } else {
        timeout = setTimeout(() => {
          const nextIndex = (currentTextIndex + 1) % descriptions.length;
          setCurrentTextIndex(nextIndex);
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentTextIndex, isTyping, descriptions]);

  // Start animations only after component mount
  useEffect(() => {
    if (!mounted) return;

    // Circle animation
    circleControls.start({
      boxShadow: [
        "0 0 40px rgba(255, 255, 255, 0.2)",
        "0 0 60px rgba(255, 255, 255, 0.3)",
        "0 0 40px rgba(255, 255, 255, 0.2)",
      ],
      scale: [1, 1.03, 1],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    });

    // Circle outer ring animation
    circleRingControls.start({
      rotate: [0, 360],
      transition: {
        duration: 120,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    });

    // Light flare animations
    flare1Controls.start({
      opacity: [0.5, 0.7, 0.5],
      scale: [1, 1.1, 1],
      x: [-10, 10, -10],
      y: [-10, 10, -10],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    });

    flare2Controls.start({
      opacity: [0.4, 0.6, 0.4],
      scale: [1, 1.1, 1],
      x: [10, -10, 10],
      y: [10, -10, 10],
      transition: {
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 1,
      },
    });

    // Cleanup function
    return () => {
      circleControls.stop();
      flare1Controls.stop();
      flare2Controls.stop();
      circleRingControls.stop();
    };
  }, [
    mounted,
    circleControls,
    flare1Controls,
    flare2Controls,
    circleRingControls,
  ]);

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* 배경 그라데이션 - 더 화려하고 생동감 있는 그라데이션 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #f6d5e3 0%, #dcd6fa 50%, #c9eaff 100%)",
        }}
      />

      {/* 움직이는 배경 그라데이션 - 마우스 위치에 따라 움직임 */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at var(--x) var(--y), rgba(219, 166, 242, 0.5), transparent 70%)",
          backgroundSize: "120% 120%",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          "--x": `${mousePosition.x * 100}%`,
          "--y": `${mousePosition.y * 100}%`,
        }}
      />

      {/* 추가 부드러운 그라데이션 레이어 */}
      <div
        className="absolute inset-0 z-1 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 30% 70%, rgba(255, 201, 235, 0.7) 0%, rgba(255, 201, 235, 0) 50%), radial-gradient(circle at 70% 30%, rgba(188, 233, 255, 0.7) 0%, rgba(188, 233, 255, 0) 50%)",
        }}
      />

      {/* 물결 패턴 배경 */}
      <svg
        className="absolute inset-0 z-1 opacity-15"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="wave-pattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d="M0,100 Q50,50 100,100 Q150,150 200,100 Q250,50 300,100 Q350,150 400,100"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,120 Q50,70 100,120 Q150,170 200,120 Q250,70 300,120 Q350,170 400,120"
              fill="none"
              stroke="rgba(138,43,226,0.2)"
              strokeWidth="0.5"
              initial={{ y: 0 }}
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,80 Q50,30 100,80 Q150,130 200,80 Q250,30 300,80 Q350,130 400,80"
              fill="none"
              stroke="rgba(70,130,180,0.2)"
              strokeWidth="0.5"
              initial={{ y: 0 }}
              animate={{ y: [-12, 12, -12] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </pattern>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#wave-pattern)"
        />
      </svg>

      {/* 중앙 원형 요소 - 더 복잡하고 시각적으로 강화된 디자인 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] z-2">
        {/* 원형 회전 링 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px dashed rgba(255, 255, 255, 0.3)",
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)",
          }}
          animate={circleRingControls}
        />

        {/* 내부 원 */}
        <motion.div
          className="absolute inset-2 rounded-full border border-white/40"
          style={{
            background:
              "linear-gradient(135deg, rgba(254, 205, 224, 0.3) 0%, rgba(214, 214, 250, 0.3) 50%, rgba(202, 235, 255, 0.3) 100%)",
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(5px)",
          }}
          animate={circleControls}
        />

        {/* 장식용 작은 원들 */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-white/50"
            style={{
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 49}%)`,
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 49}%)`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* 추가적인 빛 효과 - 더 다양하고 역동적인 빛 플레어 */}
      <div className="absolute inset-0 z-2 overflow-hidden pointer-events-none">
        {/* 원형 光芒 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "250px",
            height: "250px",
            top: "15%",
            left: "25%",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%)",
            filter: "blur(5px)",
            opacity: 0.5,
          }}
          animate={flare1Controls}
        />

        <motion.div
          className="absolute rounded-full"
          style={{
            width: "180px",
            height: "180px",
            bottom: "20%",
            right: "20%",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%)",
            filter: "blur(5px)",
            opacity: 0.4,
          }}
          animate={flare2Controls}
        />

        {/* 추가 빛 효과 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "120px",
            height: "120px",
            top: "40%",
            right: "30%",
            background:
              "radial-gradient(circle, rgba(191, 219, 254, 0.6) 0%, rgba(191, 219, 254, 0) 70%)",
            filter: "blur(4px)",
            opacity: 0.5,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute rounded-full"
          style={{
            width: "150px",
            height: "150px",
            top: "60%",
            left: "35%",
            background:
              "radial-gradient(circle, rgba(253, 224, 235, 0.6) 0%, rgba(253, 224, 235, 0) 70%)",
            filter: "blur(4px)",
            opacity: 0.5,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.15, 1],
            x: [0, -15, 0],
            y: [0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />
      </div>

      {/* 신비로운 그린 래디언스 효과 */}
      <div
        className="absolute bottom-0 left-0 w-1/3 h-2/3 opacity-30 z-2"
        style={{
          background:
            "radial-gradient(circle at bottom left, rgba(0, 255, 149, 0.2) 0%, rgba(0, 255, 149, 0) 60%)",
        }}
      />

      {/* 신비로운 퍼플 래디언스 효과 */}
      <div
        className="absolute top-0 right-0 w-1/3 h-2/3 opacity-30 z-2"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(187, 107, 255, 0.2) 0%, rgba(187, 107, 255, 0) 60%)",
        }}
      />

      {/* 콘텐츠 컨테이너 */}
      <div className="relative z-10 max-w-5xl px-6 text-center">
        {/* 상단 작은 배지 - 더 세련된 디자인 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6 px-4 py-1.5 bg-white/70 backdrop-blur-sm rounded-full shadow-xl border border-white/80"
          whileHover={{
            y: -3,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <motion.span
            className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent flex items-center"
            style={{ backgroundSize: "200% auto" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <svg
              className="w-4 h-4 mr-1.5 text-yellow-400 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            24시간 AI 고객응대 솔루션
          </motion.span>
        </motion.div>

        {/* 헤드라인 - 더 화려하고 역동적인 애니메이션 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-bold tracking-tight text-gray-800 whitespace-nowrap"
        >
          <motion.span
            className="text-4xl md:text-5xl block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            무엇이든 물어보세요
          </motion.span>
          <motion.span
            className="text-5xl md:text-7xl block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ y: 30, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              textShadow: [
                "0 0 10px rgba(149, 76, 233, 0.3)",
                "0 0 20px rgba(149, 76, 233, 0.2)",
                "0 0 10px rgba(149, 76, 233, 0.3)",
              ],
            }}
            transition={{
              y: { delay: 0.7, duration: 0.8 },
              opacity: { delay: 0.7, duration: 0.8 },
              backgroundPosition: {
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              },
              textShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            무물 챗봇이 답해드립니다
          </motion.span>
        </motion.h1>

        {/* 설명 (타이핑 효과) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col items-center justify-center text-lg md:text-xl text-gray-600"
        >
          <div className="font-mono flex items-center backdrop-blur-sm bg-white/30 px-6 py-3 rounded-xl border border-white/50 shadow-lg">
            <span className="text-gray-700 flex items-center">
              <motion.span
                className="text-indigo-500 mr-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &gt;
              </motion.span>
              {displayText}
            </span>
            <motion.div
              ref={cursorRef}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="w-[2px] h-5 bg-indigo-500 ml-1"
            />
          </div>
        </motion.div>

        {/* CTA 버튼들 - 더 세련된 디자인과 애니메이션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-14 flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.button
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-[0_5px_30px_-15px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.6)] transition-all duration-300"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="relative z-10 flex items-center justify-center"
              animate={{
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              무물 시작하기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                  opacity="0.6"
                />
              </svg>
            </motion.span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/40 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              style={{
                clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
              }}
            />
          </motion.button>

          <motion.button
            className="group relative px-8 py-4 bg-white/50 backdrop-blur-sm border border-indigo-200 text-indigo-700 rounded-full hover:bg-white/70 hover:border-indigo-300 shadow-lg transition-all duration-300"
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center">
              무물 체험하기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle at var(--x) var(--y), rgba(99, 102, 241, 0.15), transparent 80%)",
                "--x": `${mousePosition.x * 100}%`,
                "--y": `${mousePosition.y * 100}%`,
              }}
            />
          </motion.button>
        </motion.div>

        {/* 작은 브랜드 인디케이터 */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-2 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-indigo-500 tracking-widest">
            MUMUL AI
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

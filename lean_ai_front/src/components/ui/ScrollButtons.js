import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

const ScrollButtons = () => {
  const [showUpButton, setShowUpButton] = useState(false);
  const [showDownButton, setShowDownButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollRatio = scrollTop / (scrollHeight - windowHeight); // 스크롤 위치 비율 (0~1)

      if (scrollRatio < 0.1) {
        // 맨 위쪽 10% 근처
        setShowDownButton(false);
        setShowUpButton(false);
      } else if (scrollRatio >= 0.95) {
        // 거의 맨 아래
        setShowDownButton(false);
        setShowUpButton(true);
      } else {
        // 중간
        setShowDownButton(true);
        setShowUpButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 렌더 시 확인
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        {showDownButton && (
          <motion.button
            key="scroll-down"
            onClick={scrollToBottom}
            className="bg-indigo-300 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            aria-label="스크롤 아래로"
          >
            <ChevronDown className="w-7 h-7" />
          </motion.button>
        )}

        {showUpButton && (
          <motion.button
            key="scroll-up"
            onClick={scrollToTop}
             className="bg-indigo-300 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            aria-label="스크롤 위로"
          >
            <ChevronUp className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollButtons;

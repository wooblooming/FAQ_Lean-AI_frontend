"use client";

import React, { useState, useEffect } from "react";
import { Building, Store, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import StoreTab from "./StoreTab";
import CorpTab from "./CorpTab";
import PublicTab from "./PublicTab";

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("store");
  const [scrollY, setScrollY] = useState(0);

  // 전체 섹션 가시성
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });
  // 제목 가시성
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  // 탭 버튼 가시성
  const [tabsRef, tabsInView] = useInView({ threshold: 0.2 });
  // 탭 컨텐츠 가시성
  const [contentRef, contentInView] = useInView({ threshold: 0.2 });

  // 탭별 색상 데이터
  const tabColors = {
    store: {
      primary: "#F59E0B",
      secondary: "#FBBF24",
      light: "#FEF3C7",
      dark: "#92400E",
    },
    corp: {
      primary: "#10B981",
      secondary: "#34D399",
      light: "#D1FAE5",
      dark: "#166534",
    },
    public: {
      primary: "#0EA5E9",
      secondary: "#38BDF8",
      light: "#E0F2FE",
      dark: "#075985",
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
      className="w-full py-24 overflow-hidden relative"
      style={{
        background: sectionInView
          ? `radial-gradient(10% 10%, ${activeData.light}44, transparent 50%)`
          : "transparent",
      }}
    >
      {/* 배경 블롭 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: sectionInView ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div
              className="absolute rounded-full filter blur-3xl opacity-20"
              style={{
                width: "60vw",
                height: "60vw",
                right: "-20vw",
                top: "-20vw",
                background: `linear-gradient(135deg, ${activeData.primary}99, ${activeData.primary}22)`,
                transform: `rotate(${scrollY * 0.02}deg) translateY(${
                  scrollY * 0.1
                }px)`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 ">
        {/* 섹션 헤더 */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold inline-block mb-6"
            style={{
              fontFamily: "NanumSquareExtraBold",
              color: activeData.dark,
            }}
          >
            무물에서는 무엇을 할 수 있을까요?!
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg max-w-2xl mx-auto mt-6"
            style={{ fontFamily: "NanumSquare", color: activeData.dark }}
          >
            고객 질문에 최적화된 AI 기반 응대 솔루션으로 업무 효율성을
            높여보세요
          </motion.p>
        </motion.div>

        {/* 탭 버튼 그룹 (스크롤 애니메이션) */}
        <motion.div
          ref={tabsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={tabsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          {/* 소상공인용 버튼 */}
          <motion.button
            onClick={() => setActiveTab("store")}
            initial={false}
            animate={{
              backgroundColor:
                activeTab === "store" ? tabColors.store.primary : "white",
              color: activeTab === "store" ? "white" : tabColors.store.dark,
              boxShadow:
                activeTab === "store"
                  ? `0 10px 25px -5px ${tabColors.store.primary}33, 0 8px 10px -6px ${tabColors.store.primary}22`
                  : "0 1px 3px rgba(0,0,0,0.1)",
            }}
            whileHover={{
              backgroundColor:
                activeTab === "store"
                  ? tabColors.store.primary
                  : tabColors.store.light,
              y: -3,
              boxShadow: `0 15px 30px -5px ${tabColors.store.primary}33`,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 py-3.5 px-6 rounded-full relative overflow-hidden"
          >
            <div
              className={`relative p-2 rounded-full ${
                activeTab === "store"
                  ? "bg-white bg-opacity-20"
                  : "bg-amber-100"
              }`}
            >
              <Store className="w-5 h-5" />
              {activeTab === "store" && (
                <motion.div
                  layoutId="tabIconRing"
                  className="absolute inset-0 rounded-full border-2 border-white border-opacity-70"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
            </div>
            <span
              className="font-semibold"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              소상공인용
            </span>
            {activeTab === "store" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute right-3 top-0 bottom-0 flex items-center"
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            )}
          </motion.button>

          {/* 기업용 버튼 */}
          <motion.button
            onClick={() => setActiveTab("corp")}
            initial={false}
            animate={{
              backgroundColor:
                activeTab === "corp" ? tabColors.corp.primary : "white",
              color: activeTab === "corp" ? "white" : tabColors.corp.dark,
              boxShadow:
                activeTab === "corp"
                  ? `0 10px 25px -5px ${tabColors.corp.primary}33`
                  : "0 1px 3px rgba(0,0,0,0.1)",
            }}
            whileHover={{
              backgroundColor:
                activeTab === "corp"
                  ? tabColors.corp.primary
                  : tabColors.corp.light,
              y: -3,
              boxShadow: `0 15px 30px -5px ${tabColors.corp.primary}33`,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 py-3.5 px-6 rounded-full relative overflow-hidden"
          >
            <div
              className={`relative p-2 rounded-full ${
                activeTab === "corp"
                  ? "bg-white bg-opacity-20"
                  : "bg-emerald-100"
              }`}
            >
              <Building className="w-5 h-5" />
              {activeTab === "corp" && (
                <motion.div
                  layoutId="tabIconRing"
                  className="absolute inset-0 rounded-full border-2 border-white border-opacity-70"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
            </div>
            <span
              className="font-semibold"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              기업용
            </span>
            {activeTab === "corp" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute right-3 top-0 bottom-0 flex items-center"
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            )}
          </motion.button>

          {/* 공공기관용 버튼 */}
          <motion.button
            onClick={() => setActiveTab("public")}
            initial={false}
            animate={{
              backgroundColor:
                activeTab === "public" ? tabColors.public.primary : "white",
              color: activeTab === "public" ? "white" : tabColors.public.dark,
              boxShadow:
                activeTab === "public"
                  ? `0 10px 25px -5px ${tabColors.public.primary}33`
                  : "0 1px 3px rgba(0,0,0,0.1)",
            }}
            whileHover={{
              backgroundColor:
                activeTab === "public"
                  ? tabColors.public.primary
                  : tabColors.public.light,
              y: -3,
              boxShadow: `0 15px 30px -5px ${tabColors.public.primary}33`,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 py-3.5 px-6 rounded-full relative overflow-hidden"
          >
            <div
              className={`relative p-2 rounded-full ${
                activeTab === "public" ? "bg-white bg-opacity-20" : "bg-sky-100"
              }`}
            >
              <Landmark className="w-5 h-5" />
              {activeTab === "public" && (
                <motion.div
                  layoutId="tabIconRing"
                  className="absolute inset-0 rounded-full border-2 border-white border-opacity-70"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
            </div>
            <span
              className="font-semibold"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              공공기관용
            </span>
            {activeTab === "public" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute right-3 top-0 bottom-0 flex items-center"
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* 탭 컨텐츠 (스크롤 애니메이션) */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "store" && (
              <motion.div
                key="store-tab"
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
                <StoreTab />
              </motion.div>
            )}
            {activeTab === "corp" && (
              <motion.div
                key="corp-tab"
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
                <CorpTab />
              </motion.div>
            )}
            {activeTab === "public" && (
              <motion.div
                key="public-tab"
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
                <PublicTab />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

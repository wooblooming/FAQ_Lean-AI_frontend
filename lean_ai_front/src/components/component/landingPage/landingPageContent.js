import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import { ArrowRight } from "lucide-react";
import Nav from "../navBar";
import MobileLayout from "./mobileLayout";
import TabletLayout from "./tabletLayout";
import DesktopLayout from "./desktopLayout";
import CompanySection from "./companySection";
import ServiceSection from "./serviceSection";
import Footer from "../footer";

const LandingPageContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
  const isMobile = useMediaQuery({ maxWidth: 699 });
  const isTablet = useMediaQuery({ minWidth: 700, maxWidth: 999 });
  const isDesktop = useMediaQuery({ minWidth: 1000 });
  const router = useRouter();

  // 특정 섹션으로 스크롤 이동
  useEffect(() => {
    const { section } = router.query;
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router.query]);

  // 각 섹션이 뷰포트에 들어오는지 감지하는 useInView
  const [companyRef, companyInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [serviceRef, serviceInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 애니메이션 설정
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-violet-50">
      {/* 네비게이션 바 */}
      <Nav
        isMobile={isMobile}
        isTablet={isTablet}
        isDesktop={isDesktop}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* 메인 섹션 */}
      <div className="container mx-auto px-4 py-10 mt-12">
        {isMobile && <MobileLayout />}
        {isTablet && <TabletLayout />}
        {isDesktop && <DesktopLayout />}
      </div>

      {/* 회사 섹션 */}
      <motion.main
        ref={companyRef}
        id="company"
        name="company"
        className="flex-grow px-0 md:px-2 pt-12 pb-32 md:pt-20 2xl:pt-72 mx-3 "
        initial="hidden"
        animate={companyInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <CompanySection isMobile={isMobile} />
      </motion.main>

      {/* 서비스 섹션 */}
      <motion.main
        ref={serviceRef}
        id="services"
        name="services"
        className="flex-grow px-0 md:px-2 py-8 bg-white rounded-lg shadow-lg mx-3"
        initial="hidden"
        animate={serviceInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <ServiceSection
          isMobile={isMobile}
          isTablet={isTablet}
          isDesktop={isDesktop}
        />
      </motion.main>

      {/* 도입질문 섹션 */}
      <main className="flex flex-col items-center justify-center text-center mt-28 p-10 mb-5 bg-indigo-200">
        <p
          className="custom-text whitespace-nowrap"
          style={{ fontFamily: "NanumSquareBold" }}
        >
          효율적인 매장 운영을 위한 서비스, <br />
          AI 챗봇 '무물' 지금 바로 경험해 보세요!
        </p>
        <div className="items-center justify-center mt-4">
          <button
            className="bg-indigo-600 rounded-full px-8 py-3 text-center text-white pulse-button custom-button"
            style={{ fontFamily: "NanumSquareExtraBold" }}
            onClick={() =>
              router.push(
                "https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform"
              )
            }
          >
            무료 도입 상담 신청
          </button>
        </div>
      </main>

      {/* 도입 신청 버튼 */}
      <motion.div
        className="fixed bottom-24 right-2"
        style={{ zIndex: 50 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.button
          className="bg-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center group relative"
          style={{ fontFamily: "NanumSquareExtraBold" }}
          onClick={() => router.push(`${FRONTEND_DOMAIN}/apply`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* 도입 신청 텍스트 */}
          <motion.div
            className="absolute flex items-center justify-center w-full h-full"
            initial={{ opacity: 1, display: "flex" }}
            animate={{ opacity: 1, display: "flex" }}
          >
            <span className="text-sm font-bold">도입 신청</span>
          </motion.div>


        </motion.button>
      </motion.div>

      {/* 푸터 */}
      <Footer isMobile={isMobile} />

      {/* 스타일 */}
      <style jsx>{`
        .custom-text {
          font-size: 28px;
        }
        .custom-button {
          font-size: 30px;
        }

        @media (max-width: 640px) {
          .custom-text {
            font-size: 21px;
          }
          .custom-button {
            font-size: 25px;
          }
        }

        .pulse-button {
          animation: pulse 3.5s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPageContent;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Nav from '../components/navBar';
import SliderComponent from '../components/indexSlider';
import CompanySection from '../components/companySection';
import ServiceSection from '../components/serviceSection';
import Footer from '../components/footer';

const LandingPageContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { section } = router.query;
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [router.query]);

  // 각 섹션이 뷰포트에 들어오는지 감지하는 useInView
  const [companyRef, companyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [serviceRef, serviceInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // 세션 스토리지에서 토큰 확인하여 로그인 상태 설정
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/mainPageForPresident');
    } else {
      router.push('/login');
    }
  };

  const handleResize = () => {
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 애니메이션 설정
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-violet-50">
      {/* Navigation Bar */}
      <Nav isMobile={isMobile} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {/* 메인 섹션 */}
      <div name="main" className="container md:mx-auto px-4 md:px-0 py-10 mt-12">
        <motion.main
          className="flex flex-col md:flex-row items-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
          style={{ height: '70vh' }}
        >
          {/* 텍스트 섹션과 이미지 슬라이더를 PC와 모바일 버전으로 분리 */}
          {isMobile ? (
            <div className="relative w-full flex flex-col items-center justify-center">
              {/* 이미지 슬라이더 섹션 - 모바일 */}
              <div className="w-full h-auto">
                <SliderComponent />
              </div>

              {/* 텍스트 섹션 - 모바일 */}
              <div className="w-full mt-4 p-6 -skew-y-3 bg-white shadow-lg flex flex-col items-center space-y-4">
                <div className="text-gray-600 text-center whitespace-nowrap text-xl font-semibold">
                  <p>
                    무엇이든 물어보세요
                    <span className="text-2xl font-bold text-indigo-600 ml-2">QR코드로</span>
                  </p>
                  <p>
                    무엇이든 답해드려요
                    <span className="text-2xl font-bold text-indigo-600 ml-2">AI챗봇으로</span>
                  </p>
                </div>

                <div className="flex flex-col space-x-2">
                  <motion.button
                    className="text-white px-8 py-3 mb-2 rounded-full text-xl font-semibold transition-colors whitespace-pre-line bg-indigo-600"
                    style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold' }}
                    onClick={handleClick}
                  >
                    무물 이용하기
                  </motion.button>
                  <motion.button
                    className="text-white px-8 py-3 mb-2 rounded-full text-xl font-semibold transition-colors whitespace-pre-line bg-cyan-500"
                    style={{ fontFamily: 'NanumSquareBold' }}
                    onClick={() =>
                      router.push('https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform')
                    }
                  >
                    도입 신청하기
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full justify-between items-center sm:px-4">
              {/* 텍스트 섹션 */}
              <motion.div className="w-full md:w-1/3" variants={fadeInUp} transition={{ duration: 0.8 }}>
                <div name="text" className="flex flex-col justify-center items-center">
                  <div className="flex flex-col text-center text-gray-800 whitespace-nowrap text-4xl font-semibold space-y-4 mb-4">
                    <p>무엇이든 물어보세요</p>
                    <p className="text-5xl font-bold text-indigo-600">QR코드로</p>
                    <p>무엇이든 답해드려요</p>
                    <p className="text-5xl font-bold text-indigo-600">AI챗봇으로</p>
                  </div>

                  <div className="flex flex-row space-x-4">
                    <motion.button
                      className="text-white px-6 py-4 mb-2 my-4 rounded-full text-2xl transition-colors whitespace-nowrap"
                      style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareExtraBold' }}
                      onClick={handleClick}
                    >
                      무물 이용하기
                    </motion.button>
                    <motion.button
                      className="bg-cyan-500 text-white px-6 py-4 mb-2 my-4 rounded-full text-2xl transition-colors whitespace-nowrap"
                      style={{ fontFamily: 'NanumSquareExtraBold' }}
                      onClick={() =>
                        router.push('https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform')
                      }
                    >
                      도입 신청하기
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* 이미지 슬라이더 섹션 - PC */}
              <div className="w-3/5 md:block">
                <SliderComponent />
              </div>
            </div>
          )}
        </motion.main>
      </div>

      {/* 회사 Section */}
      <motion.main
        ref={companyRef}
        id="company"
        name="company"
        className="flex-grow px-0 md:px-6 py-20 "
        initial="hidden"
        animate={companyInView ? 'visible' : 'hidden'}
        variants={fadeInUp}
      >
        <CompanySection isMobile={isMobile} />
      </motion.main>

      {/* 서비스 섹션 */}
      <motion.main
        ref={serviceRef}
        id="services"
        name="services"
        className="flex-grow px-0 md:px-6 py-8 bg-white rounded-lg shadow-lg mx-2"
        initial="hidden"
        animate={serviceInView ? 'visible' : 'hidden'}
        variants={fadeInUp}
      >
        <ServiceSection isMobile={isMobile} />
      </motion.main>

      {/* 도입문의 섹션 */}
      <main
        className="flex flex-col items-center justify-center text-center mt-28 p-10 mb-5 bg-indigo-200"
      >
        <p className="custom-text whitespace-nowrap" style={{ fontFamily: 'NanumSquareBold' }}>
          효율적인 매장 운영을 위한 서비스, <br />
          AI 챗봇 '무물' 지금 바로 경험해 보세요!
        </p>
        <div className="items-center justify-center mt-4">
          <button
            className="bg-indigo-600 rounded-full px-8 py-3 text-center text-white pulse-button custom-button"
            style={{ fontFamily: 'NanumSquareExtraBold' }}
            onClick={() =>
              router.push('https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform')
            }
          >
            무료 도입 상담 신청
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer isMobile={isMobile} />

      <style jsx>{`
        .custom-text {
          font-size: 28px; /* 기본 글씨 크기 */
        }
        .custom-button {
          font-size: 30px; /* 기본 버튼 글씨 크기 */
        }

        /* 모바일 환경에서 텍스트 크기 줄이기 */
        @media (max-width: 640px) {
          .custom-text {
            font-size: 21px;
          }
          .custom-button {
            font-size: 25px; /* 모바일에서 버튼 글씨 크기 줄이기 */
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

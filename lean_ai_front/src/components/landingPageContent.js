import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, useAnimation } from 'framer-motion';
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

  // Animation controls for each section
  const companyAnimation = useAnimation();
  const serviceAnimation = useAnimation();

  // Ref and inView for each section using useInView
  const [companyRef, companyInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [serviceRef, serviceInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  // 세션 스토리지에서 토큰 확인하여 로그인 상태 설정
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleClick = () => {
    console.log('Button clicked'); // 디버깅을 위한 로그
    if (isLoggedIn) {
      router.push('/mainPageForPresident');
    } else {
      router.push('/login');
    }
  };
  // 모바일 여부를 판단하는 함수
  const handleResize = () => {
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  // 컴포넌트가 마운트될 때와 화면 크기가 변경될 때마다 모바일 여부 확인
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation control for each section based on inView
  useEffect(() => {
    if (companyInView) companyAnimation.start('visible');
    if (serviceInView) serviceAnimation.start('visible');
  }, [companyInView, serviceInView, companyAnimation, serviceAnimation]);

  // 텍스트 애니메이션 및 이미지 애니메이션 설정
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-violet-50">
      {/* Navigation Bar */}
      <Nav isMobile={isMobile} />

      {/* 메인 섹션 */}
      <div name='main' className="container md:mx-auto px-2 md:px-0 py-10 mt-12 ">
        <motion.main
          className="flex flex-col md:flex-row items-center  "
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
          style={{ height: '70vh' }}
        >

          {/* 텍스트 섹션과 이미지 슬라이더를 PC와 모바일 버전으로 분리하여 설정 */}
          {isMobile ? (
            // 모바일 버전
            <div className="relative w-full flex flex-col items-center justify-center">
              {/* 이미지 슬라이더 섹션 - 모바일 버전 */}
              <div className="w-full h-auto">
                <SliderComponent />
              </div>

              {/* 텍스트 섹션 - 모바일 버전에서 슬라이더 밑에 배치 */}
              <div className="w-full mt-4 p-6 -skew-y-3 bg-white shadow-lg flex flex-col items-center space-y-2">
                <div className='text-gray-600 text-center whitespace-nowrap text-xl font-semibold '>
                  <p>
                    무엇이든 물어보세요
                    <span className="text-2xl font-bold text-indigo-600 ml-2">
                      QR코드로
                    </span>
                  </p>
                  <p>
                    무엇이든 답해드려요
                    <span className="text-2xl font-bold text-indigo-600 ml-2">
                      AI챗봇으로
                    </span>
                  </p>

                </div>

                <motion.button
                  className="text-white px-8 py-3 mb-2 rounded-full text-xl font-semibold transition-colors whitespace-nowrap bg-indigo-600"
                  style={{ fontFamily: 'NanumSquareExtraBold' }}
                  onClick={handleClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoggedIn ? '메인 페이지로 이동' : '지금 시작하기'}
                </motion.button>
              </div>
            </div>
          ) : (
            // PC 버전
            <div className="flex w-full h-full justify-center items-center">
              {/* 텍스트 섹션 */}
              <motion.div
                className="w-full md:w-1/3 md:mr-32"
                variants={textVariants}
                transition={{ duration: 0.8 }}
              >
                <div name='text' className='flex flex-col text-center justify-center items-center text-gray-800 whitespace-nowrap text-4xl font-semibold space-y-4'>
                  <p>
                    무엇이든 물어보세요
                  </p>
                  <p className="text-5xl font-bold mb-4 text-indigo-600">
                    QR코드로
                  </p>
                  <p>
                    무엇이든 답해드려요
                  </p>
                  <p className="text-5xl font-bold mb-6 text-indigo-600">
                    AI챗봇으로
                  </p>

                  <motion.button
                    className="text-white px-8 py-4 mb-2 my-4 rounded-full text-2xl font-semibold transition-colors"
                    style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareExtraBold' }}
                    onClick={handleClick}
                    whileHover={{ scale: 1.05 }} // hover 시 버튼 확대
                    whileTap={{ scale: 0.95 }} // 클릭 시 버튼 축소
                  >
                    {isLoggedIn ? '메인 페이지로 이동' : '지금 시작하기'}
                  </motion.button>
                </div>
              </motion.div>

              {/* 이미지 슬라이더 섹션 - PC 버전 */}
              <div className="w-2/3 md:block">
                <SliderComponent />
              </div>
            </div>
          )}


        </motion.main>
      </div>

      {/* 회사 Section */}
      <motion.main
        ref={companyRef} // Ref 설정
        name="company"
        className="flex-grow px-0 md:px-6 mt-32 md:mt-0"
        initial="hidden"
        animate={companyAnimation} // 애니메이션 컨트롤
        variants={sectionVariants}
      >
        <CompanySection isMobile={isMobile} />
      </motion.main>

      {/* 서비스 섹션 */}
      <motion.main ref={serviceRef} name="service" className="flex-grow px-0 md:px-6 py-8 bg-white rounded-lg shadow-lg mx-2">
        <ServiceSection isMobile={isMobile} />
      </motion.main>

      {/* 도입문의 섹션 */}
      <div className="flex flex-col items-center justify-center text-center mt-28 p-10 mb-5 bg-indigo-200">
      <p className="custom-text whitespace-nowrap" style={{ fontFamily: 'NanumSquareBold' }}>
          효율적인 매장 운영을 위한 서비스, <br />
          AI 챗봇 '무물' 지금 바로 경험해 보세요!
        </p>
        <div className="items-center justify-center mt-4">
          <button
            className="bg-indigo-600 rounded-full px-8 py-3 text-center text-white pulse-button custom-button"
            style={{ fontFamily: 'NanumSquareExtraBold',}}
            onClick={() => router.push('https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform')}
          >
            무료 도입 상담 신청
          </button>
        </div>
      </div>

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

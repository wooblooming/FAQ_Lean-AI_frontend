import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Nav from '../components/navBar';
import SliderComponent from '../components/indexSlider';
import CompanySection from '../components/companySection';
import ServiceSection from '../components/serviceSection';
import Footer from '../components/footer';
import ModalMSG from '../components/modalText';

const LandingPageContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
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
          className="flex flex-col md:flex-row items-center md:justify-between "
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
          style={{ height: '70vh' }}
        >
          {/* 이미지 슬라이더 섹션 - 모바일 버전 */}
          <div className="w-full block md:hidden ">
            <SliderComponent />
          </div>

          {/* 텍스트 섹션 */}
          <motion.div
            className="w-full md:w-fit text-center "
            variants={textVariants}
            transition={{ duration: 0.8 }}
          >
            {!isMobile &&
              <div>
                <p className="text-4xl font-semibold mb-4 text-gray-800 whitespace-nowrap">
                  무엇이든 물어보세요
                </p>
                <p className="text-5xl font-bold mb-4 text-indigo-600 whitespace-nowrap">
                  QR코드로
                </p>
                <p className="text-4xl font-semibold mb-4 text-gray-800 whitespace-nowrap">
                  무엇이든 답해드려요
                </p>
                <p className="text-5xl font-bold mb-6 text-indigo-600 whitespace-nowrap">
                  AI챗봇으로
                </p>
                <motion.button
                  className="text-white px-10 py-4 mb-2 my-4 rounded-full text-2xl font-semibold transition-colors"
                  style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareExtraBold' }}
                  onClick={handleClick}
                  whileHover={{ scale: 1.05 }} // hover 시 버튼 확대
                  whileTap={{ scale: 0.95 }} // 클릭 시 버튼 축소
                >
                  {isLoggedIn ? '메인 페이지로 이동' : '지금 시작하기'}
                </motion.button>
              </div>
            }

{isMobile && (
  <div
    className='-skew-y-3 mt-10 p-2 bg-white w-full text-gray-600 space-y-2 relative'
    style={{ pointerEvents: 'none' }} // 클릭을 차단하지 않도록 설정
  >
    <p className="text-xl font-medium whitespace-nowrap z-10" style={{ pointerEvents: 'auto' }}> {/* 텍스트 요소에만 클릭 가능하게 설정 */}
      무엇이든 물어보세요{' '}
      <span className="text-2xl font-semibold text-indigo-600 whitespace-nowrap z-10">
        QR코드로
      </span>
    </p>
    <p className="text-xl font-medium whitespace-nowrap z-10" style={{ pointerEvents: 'auto' }}>
      무엇이든 답해드려요{' '}
      <span className="text-2xl font-semibold text-indigo-600 whitespace-nowrap z-10">
        AI챗봇으로
      </span>
    </p>


    <div className='-skew-y-3 mt-10 p-2 bg-white w-full text-gray-600 space-y-2 relative z-30' style={{ pointerEvents: 'auto' }}>
      <motion.button
        className="text-white px-8 py-3 mb-2 rounded-full text-xl font-semibold transition-colors z-30"
        style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareExtraBold', pointerEvents: 'auto' }} // 버튼에 pointer-events: auto 적용
        onClick={() => {
          console.log("Button clicked!"); // 클릭 시 로그 출력
          handleClick();
        }}
        whileHover={{ scale: 1.05 }} // hover 시 버튼 확대
        whileTap={{ scale: 0.95 }} // 클릭 시 버튼 축소
      >
        {isLoggedIn ? '메인 페이지로 이동' : '지금 시작하기'}
      </motion.button>
    </div>
  </div>
)}



          </motion.div>

          {/* 이미지 슬라이더 섹션 - pc 버전 */}
          <div className="w-1/2 hidden md:block">
            <SliderComponent />
          </div>
        </motion.main>
      </div>

      {/* 회사 Section */}
      <motion.main
        ref={companyRef} // Ref 설정
        name="company"
        className="flex-grow px-0 md:px-6 py-36 md:py-0"
        initial="hidden"
        animate={companyAnimation} // 애니메이션 컨트롤
        variants={sectionVariants}
      >
        <CompanySection isMobile={isMobile} />
      </motion.main>

      {/* 서비스 섹션 */}
      <motion.main ref={serviceRef} name="service" className="flex-grow px-0 md:px-6 py-8">
        <ServiceSection isMobile={isMobile} />
      </motion.main>

      {/* 도입문의 섹션 */}
      <div className="flex flex-col items-center justify-center text-center mt-28 p-10 mb-5 bg-indigo-200">
        <p style={{ fontSize: '28px', fontFamily: 'NanumSquareBold' }}>
          효율적인 매장 운영을 위한 서비스, <br />
          AI 챗봇 '무물' 지금 바로 경험해 보세요!
        </p>
        <div className="items-center justify-center mt-4">
          <button
            className="bg-indigo-600 rounded-full w-fit px-6 py-3 text-center text-white pulse-button"
            style={{
              fontSize: '30px',
              fontFamily: 'NanumSquareExtraBold',
            }}
            onClick={() => router.push('https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform')}
          >
            무료 도입 상담 신청
          </button>
        </div>
      </div>

      {/* Modal Component */}
      <ModalMSG show={isModalOpen} onClose={() => setIsModalOpen(false)} title="상세 내용">
        <div className="text-gray-700 whitespace-pre-line text-left">{modalContent}</div>
      </ModalMSG>

      {/* Footer */}
      <Footer isMobile={isMobile} />

      <style jsx>{`
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

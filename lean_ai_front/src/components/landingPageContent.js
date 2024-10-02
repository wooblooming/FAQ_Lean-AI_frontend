import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Nav from '../components/navBar';
import CompanySection from '../components/companySection';
import ServiceSection from '../components/serviceSection';
import SupportSection from '../components/supportSection';
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
  const supportAnimation = useAnimation();

  // Ref and inView for each section using useInView
  const [companyRef, companyInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [serviceRef, serviceInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [supportRef, supportInView] = useInView({ triggerOnce: true, threshold: 0.3 });

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
    if (supportInView) supportAnimation.start('visible');
  }, [companyInView, serviceInView, supportInView, companyAnimation, serviceAnimation, supportAnimation]);

  // 텍스트 애니메이션 및 이미지 애니메이션 설정
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFF2' }}>
      {/* Navigation Bar */}
      <Nav isMobile={isMobile} />

      {/* 메인 섹션 */}
      <motion.main
        className="flex-grow-4 flex flex-row md:pt-12"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      >
        <div className="container md:mx-auto px-6 md:px-0 flex flex-col lg:flex-row items-center justify-center">
          {/* 텍스트 섹션 */}
          <motion.div className="w-full text-left mb-0 md:mb-12 mt-28" variants={textVariants} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-medium md:font-semibold mb-2 md:mb-4 text-gray-800 whitespace-nowrap">
              무엇이든 물어보세요
            </h2>
            <h3 className="text-4xl md:text-5xl font-semibold md:font-bold mb-2 md:mb-4 text-indigo-600 whitespace-nowrap">
              QR코드로
            </h3>
            <h2 className="text-3xl md:text-4xl font-medium md:font-semibold mb-2 md:mb-4 text-gray-800 whitespace-nowrap">
              무엇이든 답해드려요
            </h2>
            <h3 className="text-4xl md:text-5xl font-semibold md:font-bold mb-4 md:mb-6 text-indigo-600 whitespace-nowrap">
              AI챗봇으로
            </h3>
            <motion.button
              className="text-white px-8 md:px-12 py-4 mb-2 rounded-full text-xl md:text-2xl font-semibold transition-colors"
              style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold' }}
              onClick={handleClick}
              whileHover={{ scale: 1.05 }} // hover 시 버튼 확대
              whileTap={{ scale: 0.95 }} // 클릭 시 버튼 축소
            >
              {isLoggedIn ? '메인 페이지로 이동' : '지금 시작하기'}
            </motion.button>
          </motion.div>

          {/* 배경 이미지 */}
          <motion.img src="/index.png" className="" style={{ width: '500px' }} alt="배경 이미지" variants={imageVariants} transition={{ duration: 0.8 }} />
        </div>
      </motion.main>

      {/* 회사 Section */}
      <motion.main
        ref={companyRef} // Ref 설정
        name="company"
        className="flex-grow px-0 md:px-6 py-3"
        initial="hidden"
        animate={companyAnimation} // 애니메이션 컨트롤
        variants={sectionVariants}
      >
        <CompanySection isMobile={isMobile} />
      </motion.main>

      {/* 서비스 섹션 */}
      <motion.main
        ref={serviceRef}
        name="service"
        className="flex-grow px-0 md:px-6 py-8"
        initial="hidden"
        animate={serviceAnimation}
        variants={sectionVariants}
      >
        <ServiceSection isMobile={isMobile} />
      </motion.main>

      {/* 고객지원 섹션 */}
      <motion.main
        ref={supportRef}
        name="support"
        className="flex-grow px-0 md:px-6 py-6"
        initial="hidden"
        animate={supportAnimation}
        variants={sectionVariants}
      >
        <SupportSection isMobile={isMobile} />
      </motion.main>

      {/* Modal Component */}
      <ModalMSG show={isModalOpen} onClose={() => setIsModalOpen(false)} title="상세 내용">
        <div className="text-gray-700 whitespace-pre-line text-left">{modalContent}</div>
      </ModalMSG>

      {/* Footer */}
      <Footer isMobile={isMobile} />
    </div>
  );
};

export default LandingPageContent;

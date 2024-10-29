import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Nav from '../components/navBar';
import CompanySection from '../components/companySection';
import ServiceSection from '../components/serviceSection';
import Footer from '../components/footer';

const LandingPageContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 상태
  const router = useRouter();

  // 특정 섹션으로 스크롤 이동
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
    setIsLoggedIn(!!token); // 토큰이 존재하면 로그인 상태로 설정
  }, []);

  // 버튼 클릭 시 로그인 상태에 따른 페이지 이동
  const handleClick = () => {
    if (isLoggedIn) { // 로그인 상태이면 메인 페이지로 이동
      router.push('/mainPageForPresident');
    } else { // 로그인 상태가 아니면 로그인 페이지로 이동
      router.push('/login');
    }
  };

  // 창 크기 조정 시 모바일 여부 확인
  const handleResize = () => {
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  // 초기 설정 및 윈도우 리사이즈 이벤트 리스너 등록
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 이벤트 제거
  }, []);

  // 애니메이션 설정
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // 캐시 버스팅을 위한 이미지 컴포넌트
  const CacheBustedImage = ({ src, alt, width, height, ...props }) => {
    const cacheBustSrc = `${src}?v=${Date.now()}`; // 타임스탬프 추가
    const imageLoader = ({ src, width, quality }) => {
      return `${src}?w=${width}&q=${quality || 75}&v=${Date.now()}`;
    };
    return (
      <Image
        src={cacheBustSrc}
        alt={alt}
        width={width}
        height={height}
        loader={imageLoader}
        {...props}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-violet-50">
      {/* 네비게이션 바 */}
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
          {/* 텍스트 섹션과 이미지를 PC와 모바일 버전으로 분리 */}
          {isMobile ? (
            <div className="relative w-full flex flex-col space-y-10 items-center justify-center">
              {/* 이미지 섹션 - 모바일 */}
              <div className="w-full h-auto">
                <CacheBustedImage
                  src='/index_mobile.png'
                  alt='mumul'
                  layout="responsive"
                  width={500}
                  height={300} 
                  className="rounded-lg"
                />
              </div>

              {/* 텍스트 섹션 - 모바일 */}
              <div className="w-full p-6 -skew-y-3 bg-white shadow-lg flex flex-col items-center space-y-4">
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
                  {/* 무물 이용하기 버튼 */}
                  <motion.button
                    className="text-white px-8 py-3 mb-2 rounded-full text-xl font-semibold transition-colors whitespace-pre-line bg-indigo-600"
                    style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold' }}
                    onClick={handleClick}
                  >
                    무물 이용하기
                  </motion.button>
                  {/* 도입 신청하기 버튼 */}
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
            <div className="flex w-full h-full items-center">
              {/* 텍스트 섹션 - PC */}
              <motion.div className="w-full md:w-1/3 z-20 mt-5" variants={fadeInUp} transition={{ duration: 0.8 }}>
                <div name="text" className="flex flex-col justify-center items-center">
                  <div className="flex flex-col text-center text-gray-800 whitespace-nowrap text-4xl font-semibold mb-8">
                    <p className="mb-3 ">무엇이든 물어보세요</p>
                    <p className="text-5xl font-bold text-indigo-600 mb-8 ">QR코드로</p>
                    <p className="mb-3 ">무엇이든 답해드려요</p>
                    <p className="text-5xl font-bold text-indigo-600">AI챗봇으로</p>
                  </div>

                  <div className="flex flex-row space-x-4 z-20">
                    {/* 무물 이용하기 버튼 */}
                    <motion.button
                      className="text-white px-6 py-4 mb-2 my-4 rounded-full text-2xl transition-colors whitespace-nowrap"
                      style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareExtraBold' }}
                      onClick={handleClick}
                    >
                      무물 이용하기
                    </motion.button>
                    {/* 도입 신청하기 버튼 */}
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

              {/* 이미지 섹션 - PC */}
              <div className=" md:block z-10 w-full py-16 " style={{ height: "730px" }}>
                <CacheBustedImage
                  src='/index_desktop.png'
                  alt='mumul'
                  layout="fill"  
                  style={{ objectFit : "contain"}} 
                  className="rounded-lg"
                  priority
                />
              </div>
            </div>
          )}
        </motion.main>
      </div>

      {/* 회사 섹션 */}
      <motion.main
        ref={companyRef}
        id="company"
        name="company"
        className="flex-grow px-0 md:px-2 py-12 "
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
        className="flex-grow px-0 md:px-2 py-8 bg-white rounded-lg shadow-lg mx-3"
        initial="hidden"
        animate={serviceInView ? 'visible' : 'hidden'}
        variants={fadeInUp}
      >
        <ServiceSection isMobile={isMobile} />
      </motion.main>

      {/* 도입질문 섹션 */}
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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Nav from '../components/navBar';
import CompanySection from '../components/companySection';
import ServiceSection from '../components/serviceSection';
import SupportSection from '../components/supportSection';
import Footer from '../components/footer';
import ModalMSG from '../components/modalText'; // 사용자 정의 모달 컴포넌트 import

const LandingPageContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부를 판단하는 상태 변수
  const router = useRouter();

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
    const isMobileDevice = window.innerWidth <= 768; // width가 768px 이하일 때 모바일로 판단
    setIsMobile(isMobileDevice);
  };

  // 컴포넌트가 마운트될 때와 화면 크기가 변경될 때마다 모바일 여부 확인
  useEffect(() => {
    handleResize(); // 초기 설정
    window.addEventListener('resize', handleResize); // 화면 크기 변화 감지

    // cleanup 함수: 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFF2' }}>
      {/* Navigation Bar */}
      <Nav isMobile={isMobile} /> {/* Nav 컴포넌트에 isMobile 전달 */}
      
      {/* 배경 이미지가 포함된 메인 섹션 */}
      <main className="flex-grow-4 flex flex-row md:pt-12 ">
        <div className="container md:mx-auto px-6 md:px-0 flex flex-col lg:flex-row items-center justify-center ">
          <div className="w-full text-left mb-0 md:mb-12 mt-28 ">
            {/* 텍스트 섹션 */}
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
            <button
              className="text-white px-8 md:px-12 py-4 mb-2 rounded-full text-xl md:text-2xl font-semibold transition-colors"
              style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold' }}
              onClick={handleClick}
            >
              {isLoggedIn ? '메인 페이지로 이동' : '지금 시작하기'}
            </button>
          </div>

          {/* 배경 이미지 */}
          <img src='/index3.png' className='' style={{ width: '500px', }} alt="배경 이미지" />

        </div>
      </main>

      {/* 회사 Section */}
      <main name="company" className="flex-grow px-6 py-6 ">
        {/* 회사 섹션에 isMobile 상태 전달 */}
        <CompanySection isMobile={isMobile} />
      </main>

      {/* 서비스 섹션 */}
      <main name="service" className="flex-grow px-6 py-8 ">
        <ServiceSection isMobile={isMobile} />
      </main>

      {/* 고객지원 섹션 */}
      <main name="support" className="flex-grow px-6 py-6 ">
        <SupportSection isMobile={isMobile} />
      </main>

      {/* Modal Component */}
      <ModalMSG show={isModalOpen} onClose={() => setIsModalOpen(false)} title="상세 내용">
        <div className="text-gray-700 whitespace-pre-line text-left">{modalContent}</div>
      </ModalMSG>

      {/* Footer */}
      <Footer isMobile={isMobile} /> {/* Footer 컴포넌트에도 isMobile 전달 */}
    </div>
  );
};

export default LandingPageContent;

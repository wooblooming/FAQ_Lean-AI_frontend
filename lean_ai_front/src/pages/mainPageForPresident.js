import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';
import { Edit3, Eye, ClipboardList, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { announcements } from './notice';
import { faqs } from './faq';
import ChangeInfo from './changeInfo';
import EditData from './editData';
import RequestData from './requestData';
import Modal from '../components/modal';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';
import Footer from '../components/footer';

// 버튼 컴포넌트 (아이콘과 텍스트 정렬)
const Button = ({ children, icon: Icon, className, ...props }) => (
  <button
    className={`flex items-center justify-center space-x-2 mt-4 px-4 py-3 w-full bg-indigo-500 text-white rounded-lg font-semibold ${className}`}
    {...props}
  >
    {Icon && <Icon className="h-5 w-5" />}
    <span>{children}</span>
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow rounded-lg p-6 space-y-3 ${className}`} {...props}>
    {children}
  </div>
);

// 최신 순으로 정렬하는 함수
const getLatestAnnouncements = () => {
  return [...announcements]
    .sort((a, b) => new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/'))) // 최신순 정렬
    .slice(0, 3); // 상위 3개만 선택
};


const MainPageWithMenu = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isChangeInfoModalOpen, setIsChangeInfoModalOpen] = useState(false);
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false);
  const [isRequestDataModalOpen, setIsReqestDataModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [message, setMessage] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false); 
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [slug, setStoreSlug] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const buttonRefs = useRef([]);
  const router = useRouter();
  const latestAnnouncements = getLatestAnnouncements();
  const latestFaqs = faqs.slice(0, 3);

  const handleResize = () => {
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      const token = sessionStorage.getItem('token');
  
      const response = await fetch(`${config.apiDomain}/api/user-stores/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 헤더에 토큰이 제대로 추가됐는지 확인
        },
      });
  
      if (response.status === 401) {
        setErrorMessage('세션이 만료되었거나 인증에 실패했습니다. 다시 로그인해 주세요.');
        setShowErrorMessageModal(true);
        sessionStorage.removeItem('token');
        router.push('/login');
        return;
      }
  
      if (!response.ok) {
        throw new Error(`Failed to fetch store information: ${response.statusText}`);
      }
  
      const storeData = await response.json();
      if (storeData && storeData.length > 0) {
        setStoreName(storeData[0].store_name);
        setStoreSlug(storeData[0].slug);
      } else {
        setStoreName('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('로딩 중에 에러가 발생 했습니다.');
      setShowErrorMessageModal(true);
    }
  };
  
  if (!isMounted) {
    return null;
  }

  const goToChatbot = () => {
    if (slug) {
      const encodedSlug = encodeURIComponent(slug);
      router.push(`/storeIntroductionOwner/${encodedSlug}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-violet-50">
      <div className="flex-grow font-sans ">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          errorMessage={errorMessage}
          showErrorMessageModal={showErrorMessageModal}
          handleErrorMessageModalClose={() => setShowErrorMessageModal(false)}
        />

        <main className="container md:mx-auto px-2 md:px-4 py-10 mt-12 flex-grow flex justify-center items-center">
          <div className="flex flex-col justify-center items-center text-center space-y-10">
            <h2 className="text-2xl md:text-3xl mt-5 md:mt-10" style={{ fontFamily: 'NanumSquareBold' }}>
              안녕하세요! {storeName}님!
            </h2>

            <main className="container md:mx-auto px-2 md:px-0 py-0 md:py-5 justify-center items-center text-center">
              <div className="grid md:grid-cols-4 gap-2 md:gap-4">
                {/* 버튼 영역 */}
                <Card>
                  <h3 className="text-2xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                    매장 정보 변경
                  </h3>
                  <p>사업장 정보를 수정하여 <br/> 최신 상태로 유지해보세요</p>
                  <div className='flex justify-center items-center'>
                    <Button icon={Edit3} onClick={() => setIsChangeInfoModalOpen(true)}> 정보 수정</Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-2xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }} >
                    챗봇 미리보기
                  </h3>
                  <p>고객에게 보여지는 <br/> 챗봇 화면을 미리 확인해보세요</p>
                  <div className='flex justify-center items-center'>
                    <Button icon={Eye} onClick={goToChatbot}>미리보기</Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-2xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                    데이터 등록
                  </h3>
                  <p>FAQ 데이터 등록을 통해 <br/> 서비스 맞춤 설정을 시작하세요.</p>
                  <div className='flex justify-center items-center'>
                    <Button icon={ClipboardList} onClick={() => setIsEditDataModalOpen(true)}> 데이터 등록</Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-2xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                    서비스 요청
                  </h3>
                  <p>FAQ 수정이나 서비스 관련 요청을 <br /> 편하게 문의하세요.</p>
                  <div className='flex justify-center items-center'>
                    <Button icon={Send} onClick={() => setIsReqestDataModalOpen(true)}> 문의하기</Button>
                  </div>
                </Card>
              </div>

              {/* 공지사항, FAQ, 통계 및 분석 섹션 */}
              <div className="grid md:grid-cols-3 gap-2 md:gap-4 mt-10">
                {/* 공지사항 섹션 */}
                <div className="bg-white rounded-lg p-6 space-y-4 ">
                  <h2 className="text-2xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>공지사항</h2>
                  <ul className="space-y-4 px-0 md:px-4">
                    {latestAnnouncements.map((announcement) => (
                      <li key={announcement.id} className="flex justify-between items-center border-b pb-2">
                        <h3
                          className="text-base font-semibold text-black truncate"
                          style={{ maxWidth: '70%' }} // 긴 제목을 생략하고 너비 제한
                        >
                          {announcement.title}
                        </h3>
                        <p className="text-xs text-gray-500 hidden md:block">{announcement.date}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end">
                    <button className="text-indigo-500 font-semibold text-sm" onClick={() => router.push('/notice')}>
                      자세히 보기
                    </button>
                  </div>
                </div>

                {/* FAQ 섹션 */}
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <h2 className="text-2xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>자주 묻는 질문</h2>
                  <ul className="space-y-2 md:space-y-4  ">
                    {latestFaqs.map((faq) => (
                      <li key={faq.id} className="overflow-hidden">
                        <button
                          className="w-full text-left px-0 md:px-4 flex justify-between items-center font-semibold"
                          onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        >
                          <span className={expandedId === faq.id ? 'text-indigo-500 ' : ''}>{faq.question}</span>
                          {expandedId === faq.id ? <ChevronUp className="h-4 w-4 text-indigo-500" /> : <ChevronDown className="h-5 w-5 text-indigo-500" />}
                        </button>
                        {expandedId === faq.id && <p className="px-6 py-2 text-gray-600 text-sm ">{faq.answer}</p>}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-5 ">
                    <button className="text-indigo-500 font-semibold text-sm" onClick={() => router.push('/faq')}>
                      더 보기
                    </button>
                  </div>
                </div>

                {/* 통계 및 분석 섹션 */}
                <div className="bg-white rounded-lg p-6 space-y-4 text-center">
                  <h2 className="text-2xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>통계 및 분석</h2>
                  <p className="text-gray-700 px-0 md:px-4">데이터가 준비 중입니다.</p>
                </div>
              </div>
            </main>


          </div>
        </main>
      </div>

      <Footer className="w-full mt-auto hidden md:block" isMobile={isMobile} />

      {isChangeInfoModalOpen && (
        <Modal onClose={() => setIsChangeInfoModalOpen(false)}>
          <ChangeInfo />
        </Modal>
      )}

      {isEditDataModalOpen && (
        <Modal
          onClose={() => { setIsEditDataModalOpen(false); }}
        >
          <EditData />
        </Modal>
      )}

      {isRequestDataModalOpen && (
        <Modal
          onClose={() => { setIsReqestDataModalOpen(false); }}
        >
          <RequestData />
        </Modal>
      )}

      <ModalErrorMSG show={showErrorMessageModal} onClose={() => setShowErrorMessageModal(false)}>
        <p style={{ whiteSpace: 'pre-line' }}>
          {typeof errorMessage === 'object' ? (
            Object.entries(errorMessage).map(([key, value]) => (
              <span key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}<br />
              </span>
            ))
          ) : (
            errorMessage
          )}
        </p>
      </ModalErrorMSG>
    </div>
  );
};

export default MainPageWithMenu;
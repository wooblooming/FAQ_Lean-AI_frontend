import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable'; // 스와이프 이벤트 처리 라이브러리
import { motion } from "framer-motion";
import { ChevronLeft, Headset, User, MailCheck } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faLocationDot, faClock, faPhone } from '@fortawesome/free-solid-svg-icons'; 
import { useAuth } from '../../contexts/authContext'; // 사용자 인증 컨텍스트
import { fetchPublicDetailData } from '../../fetch/fetchPublicDetailData'; // 특정 공공기관 데이터를 가져오는 함수
import LoadingSpinner from "@/components/ui/loadingSpinner"; // 로딩 컴포넌트
import ModalErrorMSG from '../../components/modal/modalErrorMSG'; // 에러 메시지 모달 컴포넌트
import Chatbot from '../chatBotMSG'; // 챗봇 컴포넌트

const StoreIntroductionOwnerPublic = () => {
  const router = useRouter(); // 라우터 객체 생성
  const { slug } = router.query; // URL에서 slug 파라미터를 가져옴
  const [isOwner, setIsOwner] = useState(''); // 소유자 여부 상태
  const [publicData, setPublicData] = useState([]); // 매장 데이터 상태
  const [agentId, setAgentId] = useState(null); // 챗봇 agentId 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [activeTab, setActiveTab] = useState('home'); // 활성 탭 관리
  const { token } = useAuth(); // 인증 컨텍스트에서 토큰 가져오기
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 표시 여부

  // 좌우 스와이프 이벤트 처리
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTab === 'home') {
        setActiveTab('complaint'); // 왼쪽 스와이프 시 민원 탭으로 전환
      }
    },
    onSwipedRight: () => {
      if (activeTab === 'complaint') {
        setActiveTab('home'); // 오른쪽 스와이프 시 홈 탭으로 전환
      }
    },
  });

  useEffect(() => {
    // 토큰과 slug가 존재할 경우 매장 데이터 요청
    if (token && slug) {
      setIsOwner(true); // 소유자 여부를 true로 설정
      fetchPublicDetailData(slug, token, setPublicData, setErrorMessage, setShowErrorMessageModal, isOwner); // 데이터 가져오기
    }
  }, [token, slug]);

  useEffect(() => {
    // publicData가 업데이트되면 agentId 설정 및 로딩 상태 해제
    if (publicData) {
      //console.log("publicData : ",publicData);
      setAgentId(publicData.agentId); // agentId 설정
      setIsLoading(false); // 로딩 상태 해제
    }
  }, [publicData]);

  // 로딩 중일 경우 로딩 컴포넌트 표시
  if (isLoading) return <LoadingSpinner />;

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭을 활성화
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg relative font-sans overflow-y-auto"
        style={{ width: '95%', maxWidth: '450px', height: '95%' }}>

        {/* 배너 이미지 */}
        <div className="relative">
          <img
            src={publicData.logo ? `${API_DOMAIN}${publicData.logo}` : '/images/mumullogo.jpg'}
            alt="Public"
            className="w-full h-48 object-cover"
          />
          <ChevronLeft
            className="absolute top-4 left-4 items-center bg-indigo-500 rounded-full text-white p-1 cursor-pointer"
            onClick={() => router.push('/mainPageForPublic')} // 뒤로가기 버튼
          />
        </div>

        {/* 매장 정보 */}
        <div className='flex flex-col my-3 pl-4'>
          {publicData.public_name && (
            <p id="publicName" className="font-bold text-2xl">{publicData.public_name}</p> // 매장 이름
          )}
        </div>

        {/* 탭 메뉴 */}
        <div className="tabs flex justify-around border-b-2 font-medium border-gray-300">
          <button
            className={`p-2 w-1/3 ${activeTab === 'home' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500' : ''}`}
            style={{ fontFamily: activeTab === 'home' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => handleTabClick('home')}
          >
            홈
          </button>
          <button
            className={`p-2 w-1/3 ${activeTab === 'complaint' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500 text-center' : ''}`}
            style={{ fontFamily: activeTab === 'complaint' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => handleTabClick('complaint')}
          >
            민원
          </button>
        </div>

        {/* 탭 내용 */}
        <div {...handlers} className="tab-content p-4 font-sans mt-3" style={{ fontFamily: 'NanumSquare' }}>
          {activeTab === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col space-y-8 p-2'
            >
              {/* 홈 탭 내용 */}
              <div id='information' className='flex flex-col space-y-4 text-lg'>
                <h3 className="font-bold text-2xl " style={{ fontFamily: 'NanumSquareExtraBold' }}>기관 정보</h3>
                <div id='information_data' className='flex flex-col space-y-4 text-lg px-3'>
                  {publicData.public_address && (
                    <div className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faLocationDot} /> {/* 주소 아이콘 */}
                      <p>{publicData.public_address}</p>
                    </div>
                  )}
                  {publicData.opening_hours && (
                    <div className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faClock} /> {/* 영업시간 아이콘 */}
                      <p>{publicData.opening_hours}</p>
                    </div>
                  )}
                  {publicData.public_tel && (
                    <div className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faPhone} /> {/* 전화번호 아이콘 */}
                      <p>{publicData.public_tel}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'complaint' && (
            <div className="flex flex-col items-right " style={{ height: '350px' }}>
              {/* 민원 탭 내용 */}
              <div className=''>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold "
                  style={{ fontFamily: 'NanumSquareExtraBold' }}
                >
                  민원 접수하기
                </motion.h2>

                {/* 민원 접수 절차 */}
                <div className='flex flex-col space-y-2 p-2 mt-4'>
                  <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-row space-x-5 justify-center items-center'
                  >
                    <Headset className='w-12 h-12 rounded-full bg-indigo-400 text-white p-2.5' />
                    <div className='flex flex-col space-y-1 w-10/12 '>
                      <p className='font-semibold text-indigo-500'>STEP 1</p>
                      <p>아래 민원 접수 버튼을 통해 민원을 접수 합니다.</p>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-row space-x-5 justify-center items-center'
                  >
                    <User className='w-12 h-12 rounded-full bg-indigo-400 text-white p-2.5' />
                    <div className='flex flex-col space-y-1 w-10/12'>
                      <p className='font-semibold text-indigo-500'>STEP 2</p>
                      <p>접수된 민원은 담당부서로 전달되어 담당자가 지정됩니다.</p>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-row space-x-5 justify-center items-center'
                  >
                    <MailCheck className='w-12 h-12 rounded-full bg-indigo-400 text-white p-2.5' />
                    <div className='flex flex-col space-y-1  w-10/12'>
                      <p className='font-semibold text-indigo-500'>STEP 3</p>
                      <p>민원처리가 완료되면 문자 메시지로 결과를 통보드립니다.</p>
                    </div>
                  </motion.div>
                </div>

                {/* 민원 접수 및 조회 버튼 */}
                <div className='flex flex-row justify-center items-center space-x-2 mt-2'>
                  <button
                    className='px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold text-xl'
                    onClick={() => router.push({
                      pathname: '/complaintRegister',
                      query: { slug: slug }
                    })}
                  >
                    민원 접수
                  </button>
                  <button
                    className='px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold text-xl'
                    onClick={() => router.push('/complaintStatusLookup')}
                  >
                    민원 조회
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {agentId && <Chatbot agentId={agentId} />}
      </div>

      <ModalErrorMSG show={showErrorMessageModal} onClose={() => setShowErrorMessageModal(false)}>
        <p>
          {errorMessage}
        </p>
      </ModalErrorMSG>
    </div>
  );
};

export default StoreIntroductionOwnerPublic;

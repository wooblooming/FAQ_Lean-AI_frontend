import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import { motion } from "framer-motion";
import { ChevronLeft, Headset, User, MailCheck } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faStore } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/loading';0
import ModalErrorMSG from '../../components/modalErrorMSG';
import Chatbot from '../chatBotMSG';
import config from '../../../config';

const StoreIntroductionPublic = () => {
  const router = useRouter();
  const { slug } = router.query; // URL에서 slug 파라미터 가져옴
  const [publicData, setPublicData] = useState([]); // 매장 데이터를 저장
  const [agentId, setAgentId] = useState(null); // 챗봇의 agentId를 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [activeTab, setActiveTab] = useState('home'); // 활성 탭 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

  // Swipeable hook 설정: 좌우 스와이프로 탭 전환
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTab === 'home') {
        setActiveTab('complaint'); // 왼쪽으로 스와이프하면 menu 탭으로 전환
      }
    },
    onSwipedRight: () => {
      if (activeTab === 'complaint') {
        setActiveTab('home'); // 오른쪽으로 스와이프하면 home 탭으로 전환
      }
    },
  });

  useEffect(() => {
    // 토큰이 설정된 후에만 fetchStoreData 실행
    if (slug) {
      fetchPublicData();
    }
  }, [slug]);


  // 공공기관 데이터를 가져오는 함수
  const fetchPublicData = async () => {
    try {
      const decodedSlug = decodeURIComponent(slug);  // 인코딩된 슬러그 디코딩
      const response = await fetch(`${config.apiDomain}/public/public-info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: decodedSlug,
          type: 'customer',
        }),
      });

      const result = await response.json();
      console.log("result ： ", result);
      setPublicData(result.public);
      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('로딩 중에 에러가 발생 했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  useEffect(() => {
    if(publicData){
      setAgentId(publicData.agentId);
      setIsLoading(false);
    }
  }, [publicData]);



  // 로딩 중일 때 로딩 컴포넌트를 표시
  if (isLoading) {
    return <Loading />; // 로딩 중일 때 Loading 컴포넌트를 렌더링
  }


  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭을 활성화
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg relative font-sans overflow-y-auto "
        style={{ width: '95%', maxWidth: '450px', height: '95%' }}>
        <div className="relative">
          <img
            src={
              publicData.banner
                ? `${config.apiDomain}${publicData.banner}`
                : '/mumullogo.jpg'  // 기본 이미지
            }
            alt="Public"
            className="w-full h-48 object-cover"
          />
        </div>

        {/* 매장 정보 섹션에 애니메이션 추가 */}
        <div className='flex flex-col my-3 pl-4'>
          {publicData.public_name && (
            <p id="publicName" className="font-bold text-2xl">{publicData.public_name}</p>
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
              <p className='whitespace-nowrap'>민원</p>
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
              <div id='information' className='flex flex-col space-y-4 text-lg '>
                <h3 className="font-bold text-2xl " style={{ fontFamily: 'NanumSquareExtraBold' }}>기관 정보</h3>
                <div id='information_data' className='flex flex-col space-y-4 text-lg px-3'>
                  {publicData.public_address && (
                    <div className='flex space-x-2 items-center '>
                      <FontAwesomeIcon icon={faLocationDot} />
                      <p className='whitespace-pre-line '>
                        {publicData.public_address}
                      </p>
                    </div>
                  )}
                  {publicData.opening_hours && (
                    <div id='clock' className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faClock} />
                      <p className='whitespace-pre-line'>
                        {publicData.opening_hours}
                      </p>
                    </div>
                  )}
                  {publicData.public_tel && (
                    <div id='phone' className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faPhone} />
                      <p className='whitespace-pre-line'>
                        {publicData.public_tel}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'complaint' && (
            <div className="flex flex-col items-right " style={{height:'350px'}}>
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
                      <p>민원처리가 완료 되면 그 결과를 문자메시지를 통해 고객님께 통보하여 드립니다.</p>
                    </div>
                  </motion.div>

                </div>

                {/* 민원 신청 & 현황 확인 버튼 */}
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
                    onClick={() => router.push('/complaintStausLookup')}
                  >
                    민원 조회
                  </button>
                </div>
              </div>
            </div>
          )
          }
        </div>

        {/* Chatbot */}
        {agentId && <Chatbot agentId={agentId} />} {/* agentId를 Chatbot 컴포넌트에 전달 */}
      </div>

       {/* 에러 메시지 모달 */}
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

export default StoreIntroductionPublic;

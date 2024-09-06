import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faStore } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable'; // Swipeable Hook 사용
import Loading from '../components/loading'; // 로딩 컴포넌트 import
import Chatbot from './chatBotMSG'; // 챗봇 컴포넌트 import
import config from '../../config';

const StoreIntroduce = () => {
  const router = useRouter();
  const { id } = router.query; // URL에서 id 파라미터 가져옴
  const [storeData, setStoreData] = useState(null); // 매장 데이터를 저장
  const [agentId, setAgentId] = useState(null); // 챗봇의 agentId를 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [activeTab, setActiveTab] = useState('home'); // 활성 탭(home 또는 menu)을 관리하는 상태

  // Swipeable hook 설정: 좌우 스와이프로 탭 전환
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTab === 'home') {
        setActiveTab('menu'); // 왼쪽으로 스와이프하면 menu 탭으로 전환
      }
    },
    onSwipedRight: () => {
      if (activeTab === 'menu') {
        setActiveTab('home'); // 오른쪽으로 스와이프하면 home 탭으로 전환
      }
    },
  });

  // 매장 데이터를 가져오는 비동기 함수, 컴포넌트가 처음 마운트될 때 실행됨
  useEffect(() => {
    if (id) {
      const fetchStoreData = async () => {
        try {
          const response = await axios.post(`${config.apiDomain}/api/storesinfo/`, {
            store_id: id, // store_id를 POST 요청으로 전송
            type: 'customer', // 고객 유형으로 데이터 요청
          });
          setStoreData(response.data); // 받아온 데이터를 storeData 상태에 저장
          setAgentId(response.data.agent_id); // 챗봇의 agentId를 설정
        } catch (error) {
          console.error("Error fetching store data:", error); // 데이터 가져오기 실패 시 에러 처리
        } finally {
          setIsLoading(false); // 데이터를 가져온 후 로딩 상태 해제
        }
      };

      fetchStoreData(); // 매장 데이터를 가져오는 함수 호출
    }
  }, [id]);  

  // 로딩 중일 때 로딩 컴포넌트를 표시
  if (isLoading) {
    return <Loading />; // 로딩 상태일 때 Loading 컴포넌트 렌더링
  }

  // 매장 데이터가 없을 경우
  if (!storeData) {
    return <div>Store not found.</div>; // 매장 정보를 찾지 못한 경우
  }

  // 탭을 클릭할 때 호출되는 함수, 클릭한 탭을 활성화
  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭을 activeTab으로 설정
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg relative"
        style={{ width: '90%', maxWidth: '400px', height: '95%', maxHeight: '675px' }}>
        <div className="w-full h-full overflow-y-auto"> {/* 모달 내부에 콘텐츠 배치 */}
          <div className=" mb-2" style={{ height: '45%', maxHeight: '200px' }}>
            <img
              src={
                storeData.store_image
                  ? `${config.apiDomain}${storeData.store_image}` // 매장 이미지가 있으면 출력
                  : '/testBanner.png'  // 기본 이미지
              }
              alt="Store"
              className="w-full h-full object-cover"
            />
          </div>
          <div className='flex flex-col my-3 pl-4'>
            <p id="storeName" className="font-bold text-2xl">{storeData.store_name}</p>
            <p className='whitespace-pre-line text-sm'>
              {/* 매장 설명을 여기서 넣을 수 있음 */}
            </p>
          </div>
          
          {/* 탭 메뉴 */}
          <div className="tabs flex justify-around border-b-2 border-gray-300">
            <button
              className={`p-2 ${activeTab === 'home' ? 'text-blue-400 border-b-2 border-blue-400' : ''}`}
              onClick={() => handleTabClick('home')} // home 탭 클릭 시 호출
            >
              홈
            </button>
            <button
              className={`p-2 ${activeTab === 'menu' ? 'text-blue-400 border-b-2 border-blue-400' : ''}`}
              onClick={() => handleTabClick('menu')} // menu 탭 클릭 시 호출
            >
              상품
            </button>
          </div>

          {/* 탭 내용 */}
          <div {...handlers} className="tab-content p-4 font-sans mt-3">
            {activeTab === 'home' && ( // home 탭이 활성화된 경우
              <div id='home'>
                <h3 className="font-bold text-xl ml-2 mb-4">매장 정보</h3>
                <div id='location' className='flex flex-col ml-6 text-lg'>
                  {/* 매장 주소 */}
                  <div className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_address}
                    </p>
                  </div>
                  {/* 영업 시간 */}
                  <div id='clock' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faClock} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_hours}
                    </p>
                  </div>
                  {/* 매장 전화번호 */}
                  <div id='phone' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faPhone} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_tel}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menu' && ( // menu 탭이 활성화된 경우
              <div>
                <h3 className="font-bold text-xl mb-4">상품</h3>
                {/* 메뉴 정보가 있는 경우 */}
                {storeData.menu_prices ? (
                  <p className='whitespace-pre-line mb-4'>
                    {storeData.menu_prices}
                  </p>
                ) : (
                  <p className='whitespace-pre-line mb-4'>메뉴 정보가 없습니다.</p>
                )}
              </div>
            )}
          </div>

          {/* Chatbot 컴포넌트 */}
          {agentId && <Chatbot agentId={agentId} />} {/* agentId가 있으면 Chatbot 컴포넌트에 전달 */}
        </div>
      </div>
    </div>
  );
};

export default StoreIntroduce;

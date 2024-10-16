import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faStore } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable'; // Swipeable Hook 사용
import Loading from '../../components/loading'; // 로딩 컴포넌트 import
import Chatbot from '../chatBotMSG'; // 챗봇 컴포넌트 import
import config from '../../../config';

const StoreIntroduceOwner = () => {
  const router = useRouter();
  const { slug } = router.query; // URL에서 slug 파라미터 가져옴
  const [storeData, setStoreData] = useState(null); // 매장 데이터를 저장
  const [storeCategory, setStoreCategory] = useState('');
  const [menuPrice, setMenuPrice] = useState(null);
  const [agentId, setAgentId] = useState(null); // 챗봇의 agentId를 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [activeTab, setActiveTab] = useState('home'); // 활성 탭 관리

  // 메뉴 탭 이름 설정 함수
  const getMenuTitle = (storeCategory) => {
    return storeCategory === 'RESTAURANT'
      ? '메뉴'
      : storeCategory === 'RETAIL'
        ? '상품'
        : storeCategory === 'PUBLIC'
          ? '서비스'
          : '기타';
  };

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
    if (slug) {
      const fetchStoreData = async () => {
        try {
          const decodedSlug = decodeURIComponent(slug);  // 인코딩된 슬러그 디코딩
          //console.log('Decoded slug:', decodedSlug);

          const token = sessionStorage.getItem('token');
          const response = await axios.post(`${config.apiDomain}/api/storesinfo/`,
            {
              slug: decodedSlug, // 디코딩 된 slug로 데이터 
              type: 'owner', // 업주 유형으로 데이터 요청
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          setStoreData(response.data); // 받아온 데이터를 storeData 상태에 저장
          console.log("Store Data:", response.data); // 데이터 확인

        } catch (error) {
          console.error("Error fetching store data:", error);
        } finally {
          setIsLoading(false);  // 로딩 상태 변경 확인
        }
      };

      fetchStoreData(); // 매장 데이터를 가져오는 함수 호출
    }
  }, [slug]); // slug가 변경될 때마다 데이터를 다시 가져옴

  // storeData가 변경된 이후에 agent_id를 설정
  useEffect(() => {
    if (storeData) {
      setAgentId(storeData.agent_id);
      setStoreCategory(storeData.store_category);
      setMenuPrice(JSON.parse(storeData.menu_prices));

      console.log("menu_price : ", menuPrice);
    }
  }, [storeData]); // storeData가 업데이트될 때마다 실행

  // 로딩 중일 때 로딩 컴포넌트를 표시
  if (isLoading) {
    return <Loading />; // 로딩 중일 때 Loading 컴포넌트를 렌더링
  }

  // 매장 데이터가 없을 경우
  if (!storeData) {
    return <div>Store not found.</div>;
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭을 활성화
  };

  const menuTitle = getMenuTitle(storeData.store_category); // 메뉴 탭 이름 설정

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg relative"
        style={{ width: '90%', maxWidth: '400px', height: '95%', maxHeight: '675px' }}>
        <div className="w-full h-full overflow-y-auto"> {/* 모달 내부에 콘텐츠 배치 */}
          <Link href="/mainPageForPresident" className="absolute top-4 left-0 text-gray-500 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className=" mb-2" style={{ height: '45%', maxHeight: '200px' }}>
            <img
              src={
                storeData.store_image
                  ? `${config.apiDomain}${storeData.store_image}`
                  : '/testBanner.png'  // 기본 이미지
              }
              alt="Store"
              className="w-full h-full object-cover"
            />
          </div>
          <div className='flex flex-col my-3 pl-4'>
            <p id="storeName" className="font-bold text-2xl">{storeData.store_name}</p>
            <p className='whitespace-pre-line text-base mt-1'>
              {storeData.store_introduction}
            </p>
          </div>

          {/* 탭 메뉴 */}
          <div className="tabs flex justify-around border-b-2 border-gray-300">
            <button
              className={`p-2 w-1/3  ${activeTab === 'home' ? 'text-violet-500 text-lg font-bold border-b-2 border-violet-400' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              Home
            </button>
            <button
              className={`p-2 w-1/3  ${activeTab === 'menu' ? 'text-violet-500 text-lg font-bold border-b-2 border-violet-400' : ''}`}
              onClick={() => handleTabClick('menu')}
            >
              {menuTitle}
            </button>
          </div>

          {/* 탭 내용 */}
          <div {...handlers} className="tab-content p-4 font-sans mt-3">
            {activeTab === 'home' && (
              <div id='home' >
                <h3 className="font-bold text-xl ml-2 mb-4">매장 정보</h3>
                <div id='location' className='flex flex-col ml-6 text-lg'>
                  <div className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_address}
                    </p>
                  </div>
                  <div id='clock' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faClock} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_hours}
                    </p>
                  </div>
                  <div id='phone' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faPhone} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_tel}
                    </p>
                  </div>
                  <div id='store' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faStore} />
                    <p className='whitespace-pre-line ml-2'>
                      {/*반려동물 동반가능, 주차 가능*/}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div>
                <h3 className="font-bold text-xl mb-4">{menuTitle}</h3>
                {storeData.menu_price ? (
                  <div className='space-y-2'>
                    {JSON.parse(storeData.menu_price).map((menu, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{menu.name}</span>
                        <span>{menu.price.toLocaleString()} 원</span> {/* 가격에 천 단위 콤마 추가 */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='whitespace-pre-line mb-4'>메뉴 정보가 없습니다.</p>
                )}
              </div>
            )}

          </div>

          {/* Chatbot */}
          {agentId && <Chatbot agentId={agentId} />} {/* agentId를 Chatbot 컴포넌트에 전달 */}
        </div>
      </div>
    </div>
  );
};

export default StoreIntroduceOwner;

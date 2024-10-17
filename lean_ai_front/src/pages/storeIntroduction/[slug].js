import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faStore } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable'; // Swipeable Hook 사용
import Loading from '../../components/loading'; // 로딩 컴포넌트 import
import Chatbot from '../chatBotMSG'; // 챗봇 컴포넌트 import
import config from '../../../config';

const StoreIntroduce = () => {
  const router = useRouter();
  const { slug } = router.query; // URL에서 slug 파라미터 가져옴
  const [storeData, setStoreData] = useState(null); // 매장 데이터를 저장
  const [storeCategory, setStoreCategory] = useState('');
  const [menuPrice, setMenuPrice] = useState(null);
  const [agentId, setAgentId] = useState(null); // 챗봇의 agentId를 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [activeTab, setActiveTab] = useState('home'); // 활성 탭 관리
  const [openCategories, setOpenCategories] = useState({}); // 아코디언 상태 관리

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

          const token = sessionStorage.getItem('token');
          const response = await axios.post(`${config.apiDomain}/api/storesinfo/`,
            {
              slug: decodedSlug, // 디코딩 된 slug로 데이터 
              type: 'customer', // 업주 유형으로 데이터 요청
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          // 응답 데이터가 비어 있는지 확인
        if (response.data && response.data.menu_prices) {
          // JSON.parse()를 안전하게 사용
          try {
            const menuPrices = JSON.parse(response.data.menu_prices);
            setMenuPrice(menuPrices); // 메뉴 데이터를 파싱해서 저장
          } catch (parseError) {
            console.error("Error parsing menu prices:", parseError);
          }
        } else {
          console.error("No menu_prices found in response data.");
        }

        setStoreData(response.data); // 받아온 데이터를 storeData 상태에 저장
        //console.log("Store Data:", response.data); // 데이터 확인

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
    }
  }, [storeData]); // storeData가 업데이트될 때마다 실행

  // 메뉴를 카테고리별로 그룹화하는 함수
  const groupMenuByCategory = (menuList) => {
    return menuList.reduce((acc, menu) => {
      const { category } = menu;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(menu);
      return acc;
    }, {});
  };

  // 아코디언 상태 토글 함수
  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // 로딩 중일 때 로딩 컴포넌트를 표시
  if (isLoading) {
    return <Loading />; // 로딩 중일 때 Loading 컴포넌트를 렌더링
  }

  // 매장 데이터가 없을 경우
  if (!storeData) {
    sto
    return <div>Store not found.</div>;
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭을 활성화
  };


  // 메뉴 탭 이름 설정
  const menuTitle = getMenuTitle(storeCategory);

  // 메뉴를 카테고리별로 묶기
  const groupedMenu = menuPrice ? groupMenuByCategory(menuPrice) : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg relative font-sans overflow-y-auto "
        style={{ width: '95%', maxWidth: '430px', height: '95%' }}>
        <div className="relative">
          <img
            src={
              storeData.store_image
                ? `${config.apiDomain}${storeData.store_image}`
                : '/testBanner.png'  // 기본 이미지
            }
            alt="Store"
            className="w-full h-48 object-cover"
          />
        </div>
  
        {/* 매장 정보 섹션에 애니메이션 추가 */}
        <div className='flex flex-col my-3 pl-4'>
          {storeData.store_name && (
            <p id="storeName" className="font-bold text-2xl">{storeData.store_name}</p>
          )}
          {storeData.store_introduction && (
            <p className='whitespace-pre-line text-base mt-1'>
              {storeData.store_introduction}
            </p>
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
            className={`p-2 w-1/3 ${activeTab === 'menu' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500' : ''}`}
            style={{ fontFamily: activeTab === 'menu' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => handleTabClick('menu')}
          >
            {menuTitle}
          </button>
        </div>
  
        {/* 탭 내용 */}
        <div {...handlers} className="tab-content p-4 font-sans mt-3" style={{ fontFamily: 'NanumSquare' }}>
          {activeTab === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold text-2xl ml-2 mb-4" style={{ fontFamily: 'NanumSquareExtraBold' }}>매장 정보</h3>
              <div id='location' className='flex flex-col ml-6 text-lg'>
                {storeData.store_address && (
                  <div className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_address}
                    </p>
                  </div>
                )}
                {storeData.store_hours && (
                  <div id='clock' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faClock} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_hours}
                    </p>
                  </div>
                )}
                {storeData.store_tel && (
                  <div id='phone' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faPhone} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_tel}
                    </p>
                  </div>
                )}
                {storeData.store_information && (
                  <div id='information' className='flex items-center mb-3'>
                    <FontAwesomeIcon icon={faStore} />
                    <p className='whitespace-pre-line ml-2'>
                      {storeData.store_information}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
  
          {activeTab === 'menu' && (
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold mb-4 "
                style={{ fontFamily: 'NanumSquareExtraBold' }}
              >
                {menuTitle}
              </motion.h2>
              {groupedMenu ? (
                Object.entries(groupedMenu).map(([category, menus], index) => (
                  <div key={index}>
                    {/* 카테고리 제목 */}
                    <motion.div
                      onClick={() => toggleCategory(category)}
                      className={`cursor-pointer bg-indigo-300 p-3 ${openCategories[category] ? 'rounded-t-md' : 'rounded-md'}`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="text-lg font-semibold text-white">{category}</h3>
                    </motion.div>
  
                    {/* 메뉴 목록 (아코디언) */}
                    {openCategories[category] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className=""
                      >
                        {menus.map((menu, itemIndex) => (
                          <React.Fragment key={itemIndex}>
                            <motion.div
                              whileTap={{ scale: 0.98 }}
                              className="bg-white overflow-hidden duration-300 flex items-center"
                            >
                              <img
                                src={menu.image ? `${config.apiDomain}${menu.image}` : '/menu_default_image.png'}
                                alt={menu.name}
                                className="w-16 h-16 object-cover"
                              />
                              <div className="p-3 flex-1 text-sm font-semibold text-gray-800">
                                <p className="mb-1">{menu.name}</p>
                                <p className="">{menu.price.toLocaleString()} 원</p>
                              </div>
                            </motion.div>
  
                            {/* 구분선 추가 (마지막 메뉴는 제외) */}
                            {itemIndex < menus.length - 1 && (
                              <div className="border-t border-gray-300 my-2 mx-4 "></div>
                            )}
                          </React.Fragment>
                        ))}
  
                      </motion.div>
                    )}
                  </div>
                ))
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
  );
};  

export default StoreIntroduce;

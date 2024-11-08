import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import { motion } from "framer-motion";
import { ChevronLeft, TriangleAlert, Headset, User, MailCheck } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faStore } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/authContext';
import Loading from '../../components/loading';
import AllergyModal from '../../components/allergyModal';
import Chatbot from '../chatBotMSG';
import config from '../../../config';

const StoreIntroduceOwner = () => {
  const router = useRouter();
  const { slug } = router.query; // URL에서 slug 파라미터 가져옴
  const [storeData, setStoreData] = useState(null); // 매장 데이터를 저장
  const [storeID, setStoreID] = useState(null);
  const [storeCategory, setStoreCategory] = useState('');
  const [menuPrice, setMenuPrice] = useState(null);
  const [menuDetails, setMenuDetails] = useState(null); // 메뉴 세부 정보를 저장
  const [agentId, setAgentId] = useState(null); // 챗봇의 agentId를 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [activeTab, setActiveTab] = useState('home'); // 활성 탭 관리
  const [openCategories, setOpenCategories] = useState({}); // 아코디언 상태 관리
  const { token } = useAuth();
  const [showAllergyModal, setShowAllergyModal] = useState(false); // 알레르기 모달 상태 관리

  // 메뉴 탭 이름 설정 함수
  const getMenuTitle = (storeCategory) => {
    return storeCategory === 'FOOD'
      ? '메뉴'
      : storeCategory === 'RETAIL' || storeCategory === 'UNMANNED'
        ? '상품'
        : storeCategory === 'PUBLIC'
          ? '서비스'
          : '기타'
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

  useEffect(() => {
    // 토큰이 설정된 후에만 fetchStoreData 실행
    if (token && slug) {
      fetchStoreData();
    }
  }, [token, slug]);


  // 매장 데이터를 가져오는 함수
  const fetchStoreData = async () => {
    try {
      const decodedSlug = decodeURIComponent(slug);  // 인코딩된 슬러그 디코딩
      const response = await fetch(`${config.apiDomain}/api/storesinfo/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: decodedSlug,
          type: 'owner',
        }),
      });

      const data = await response.json();

      // 응답 데이터가 비어 있는지 확인
      if (data && data.menu_prices) {
        // JSON.parse()를 안전하게 사용
        try {
          const menuPrices = JSON.parse(data.menu_prices);
          setMenuPrice(menuPrices); // 메뉴 데이터를 파싱해서 저장

          // 콘솔에 menuPrice 데이터를 출력
          //console.log("Parsed menuPrices:", menuPrices)
        } catch (parseError) {
          console.error("Error parsing menu prices:", parseError);
        }
      } else {
        console.error("No menu_prices found in response data.");
      }

      setStoreData(data); // 받아온 데이터를 storeData 상태에 저장
    } catch (error) {
      console.error("Error fetching store data:", error);
    } finally {
      setIsLoading(false);  // 로딩 상태 변경 확인
    }
  };

  // storeCategory가 'FOOD'일 때 menu-details API를 호출하여 메뉴 세부 정보를 가져옴
  useEffect(() => {
    const fetchMenuDetails = async () => {
      if (storeCategory === 'FOOD' && token) {
        try {
          const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'view',
              slug: slug,
              type: 'owner'
            }),
          });

          const data = await response.json();
          setMenuDetails(data); // 메뉴 세부 정보 저장
          //console.log("Menu Details:", data); // 데이터 확인용 콘솔 출력
        } catch (error) {
          console.error("Error fetching menu details:", error);
        }
      }
    };

    fetchMenuDetails();
  }, [storeCategory, token]); // storeCategory가 'FOOD'일 때와 token이 설정되었을 때만 실행

  const toggleAllergyModal = () => {
    setShowAllergyModal((prev) => !prev);
  };

  // storeData가 변경된 이후에 agent_id를 설정
  useEffect(() => {
    console.log(storeData);
    if (storeData) {
      setAgentId(storeData.agent_id);
      setStoreCategory(storeData.store_category);
      setStoreID(storeData.store_id)
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
        style={{ width: '95%', maxWidth: '450px', height: '95%' }}>
        <div className="relative">
          <img
            src={
              storeData.store_image
                ? `${config.apiDomain}${storeData.store_image}`
                : '/mumullogo.jpg'  // 기본 이미지
            }
            alt="Store"
            className="w-full h-48 object-cover"
          />
          <ChevronLeft
            className="absolute top-4 left-4 items-center bg-indigo-500 rounded-full text-white p-1 cursor-pointer"
            onClick={() => router.push('/mainPageForPresident')}
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
            className={`p-2 w-1/4 ${activeTab === 'home' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500' : ''}`}
            style={{ fontFamily: activeTab === 'home' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => handleTabClick('home')}
          >
            홈
          </button>
          <button
            className={`p-2 w-1/4 ${activeTab === 'menu' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500' : ''}`}
            style={{ fontFamily: activeTab === 'menu' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => handleTabClick('menu')}
          >
            {menuTitle}
          </button>
          {storeCategory === 'PUBLIC' &&
            <button
              className={`p-2 w-1/4 ${activeTab === 'complaint' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500 text-center' : ''}`}
              style={{ fontFamily: activeTab === 'complaint' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
              onClick={() => handleTabClick('complaint')}
            >
              <p className='whitespace-nowrap'>민원</p>
            </button>
          }
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
                <h3 className="font-bold text-2xl " style={{ fontFamily: 'NanumSquareExtraBold' }}>매장 정보</h3>
                <div id='information_data' className='flex flex-col space-y-4 text-lg px-3'>
                  {storeData.store_address && (
                    <div className='flex space-x-2 items-center '>
                      <FontAwesomeIcon icon={faLocationDot} />
                      <p className='whitespace-pre-line '>
                        {storeData.store_address}
                      </p>
                    </div>
                  )}
                  {storeData.store_hours && (
                    <div id='clock' className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faClock} />
                      <p className='whitespace-pre-line'>
                        {storeData.store_hours}
                      </p>
                    </div>
                  )}
                  {storeData.store_tel && (
                    <div id='phone' className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faPhone} />
                      <p className='whitespace-pre-line'>
                        {storeData.store_tel}
                      </p>
                    </div>
                  )}
                  {storeData.store_information && (
                    <div id='information' className='flex space-x-2 items-center'>
                      <FontAwesomeIcon icon={faStore} />
                      <p className='whitespace-pre-line'>
                        {storeData.store_information}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-2">
              <div className='flex flex-row space-x-3 items-center'>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold "
                  style={{ fontFamily: 'NanumSquareExtraBold' }}
                >
                  {menuTitle}
                </motion.h2>
                {/* 매장이 음식점일 때만 알레르기 모달 표시 */}
                {storeCategory === 'FOOD' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-row text-indigo-600 space-x-1 cursor-pointer' onClick={toggleAllergyModal}
                  >
                    <TriangleAlert /> <p>알레르기 </p>
                  </motion.div>
                )}
              </div>
              {groupedMenu ? (
                Object.entries(groupedMenu).map(([category, menus], index) => (
                  <div key={index}>
                    {/* 카테고리 제목 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => toggleCategory(category)}
                      className={`cursor-pointer bg-indigo-300 p-3 ${openCategories[category] ? 'rounded-t-md' : 'rounded-md'}`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="text-lg font-semibold text-white">{category}</h3>
                    </motion.div>

                    {/* 메뉴 목록 */}
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
                      pathname: '/registerComplaint',
                      query: { storeID: storeID }
                    })}
                  >
                    민원 접수
                  </button>
                  <button 
                    className='px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold text-xl' 
                    onClick={() => router.push('/complaintLookup')}
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

      {/* Allergy Modal */}
      <AllergyModal
        show={showAllergyModal}
        onClose={toggleAllergyModal}
        menuDetails={menuDetails} // 메뉴 상세 데이터를 모달로 전달
      />
    </div>
  );
};

export default StoreIntroduceOwner;

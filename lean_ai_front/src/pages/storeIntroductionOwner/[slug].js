import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/authContext';
import { useSwipeable } from 'react-swipeable';
import Loading from '../../components/loading';
import StoreBanner from '../../components/storeBanner';
import StoreInfo from '../../components/storeInfo';
import MenuList from '../../components/menuList';
import ImageList from '../../components/imageList'
import { fetchStoreData } from '../../fetch/fetchStoreData';
import { fetchFeedImage } from '../../fetch/fetchStoreFeed';
import ModalErrorMSG from '../../components/modalErrorMSG';
import Chatbot from '../chatBotMSG';

const StoreIntroduceOwner = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { token } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [images, setImages] = useState([]);;
  const [storeCategory, setStoreCategory] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [menuPrice, setMenuPrice] = useState([]);
  const [isOwner, setIsOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const tabOrder = ['home', 'menu', 'image']; // 탭 순서 배열
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

  useEffect(() => {
    if (token && slug) {
      setIsOwner(true);
      fetchStoreData({ slug }, token, setStoreData, setErrorMessage, setShowErrorMessageModal, isOwner);
      fetchFeedImage({ slug }, token, setImages); // 피드 가져오기
      setIsLoading(false);
    }
  }, [token, slug]);


  useEffect(() => {
    if (storeData?.store) {
      //console.log("store data : ", storeData.store);
      setStoreCategory(storeData.store.store_category);
      setAgentId(storeData.store.agent_id);
  
      // menu_price가 JSON 문자열인 경우 파싱
      try {
        const parsedMenuPrice = JSON.parse(storeData.store.menu_price);
        setMenuPrice(parsedMenuPrice);
      } catch (error) {
        console.error("Error parsing menu_price:", error);
      }
    }
  }, [storeData]);
  
  // Swipeable hook 설정: 좌우 스와이프로 탭 전환
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentIndex + 1]); // 다음 탭으로 이동
      }
    },
    onSwipedRight: () => {
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabOrder[currentIndex - 1]); // 이전 탭으로 이동
      }
    },
    trackTouch: true, // 터치 이벤트 추적
  });
  

  if (isLoading) return <Loading />;
  if (!storeData) return <div>Store not found.</div>;

  const getMenuTitle = (storeCategory) => {
    return storeCategory === 'FOOD'
      ? '메뉴'
      : storeCategory === 'RETAIL' || storeCategory === 'UNMANNED'
        ? '상품'
        : '기타'
  };

  const menuTitle = getMenuTitle(storeCategory);

  return (
    <div>
    <div {...handlers} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg relative font-sans overflow-y-auto" style={{ width: '95%', maxWidth: '450px', height: '95%' }}>
        <StoreBanner banner={storeData.store.banner} onBack={() => router.push('/mainPageForPresident')} isOwner={true} />
        <div className='flex flex-col my-3 pl-4 ' >
          {storeData?.store?.store_name && (
            <p id="storeName" className="font-bold text-3xl" style={{ fontFamily: 'NanumSquareExtraBold' }}>
              {storeData.store.store_name}
            </p>
          )}
          {storeData?.store?.store_introduction &&
            <p className='whitespace-pre-line text-lg mt-1' style={{ fontFamily: 'NanumSquare' }}>
              {storeData.store.store_introduction}
            </p>
          }
        </div>

        <div className='tabs flex justify-around border-b-2 font-medium border-gray-300' style={{ fontFamily: "NanumSquareExtraBold" }}>
          <button
            className={`p-2 w-1/4 ${activeTab === 'home' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500' : ''}`}
            style={{ fontFamily: activeTab === 'home' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => setActiveTab('home')}
          >
            홈
          </button>
          <button
            className={`p-2 w-1/4 ${activeTab === 'menu' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500' : ''}`}
            style={{ fontFamily: activeTab === 'menu' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => setActiveTab('menu')}
          >
            {menuTitle}
          </button>
          
          <button
            className={`p-2 w-1/4 ${activeTab === 'image' ? 'text-indigo-600 text-xl font-bold border-b-4 border-indigo-500' : ''}`}
            style={{ fontFamily: activeTab === 'image' ? 'NanumSquareExtraBold' : 'NanumSquareBold' }}
            onClick={() => setActiveTab('image')}
          >
            피드
          </button> 
        </div>
        <div className="p-4 font-sans mt-3">
          {activeTab === 'home' && <StoreInfo storeData={storeData.store} />}
          {activeTab === 'menu' && <MenuList menuPrice={menuPrice} storeCategory={storeCategory} menuTitle={menuTitle} />}
          {activeTab === 'image' && <ImageList images={images} />}
        </div>
      </div>
      {agentId && <Chatbot agentId={agentId} />} {/* agentId를 Chatbot 컴포넌트에 전달 */}
      
    </div>
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

export default StoreIntroduceOwner;

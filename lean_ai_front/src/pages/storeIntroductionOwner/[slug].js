import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/authContext';
import { useSwipeable } from 'react-swipeable';
import LoadingSpinner from "@/components/ui/loadingSpinner";
import StoreBanner from '../../components/ui/storeBanner';
import StoreInfo from '../../components/component/store/storeInfo';
import MenuList from '../../components/component/store/menuList';
import FeedList from '../../components/component/store/feedList';
import { fetchStoreData } from '../../fetch/fetchStoreData';
import { fetchStoreMenu } from '../../fetch/fetchStoreMenu';
import { fetchFeedImage } from '../../fetch/fetchStoreFeed';
import ModalErrorMSG from '../../components/modal/modalErrorMSG';
import Chatbot from '../chatBotMSG';

const StoreIntroduceOwner = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { token } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [images, setImages] = useState([]);
  const [storeCategory, setStoreCategory] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const tabOrder = ['home', 'menu', 'image']; // 탭 순서 배열
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);

  useEffect(() => {
    if (token && slug) {
      fetchStoreData({ slug }, token, setStoreData, setErrorMessage, setShowErrorMessageModal);
      fetchStoreMenu({ slug }, token, setMenu, setErrorMessage, setShowErrorMessageModal);
      fetchFeedImage({ slug }, token, setImages);
    }
  }, [token, slug]);

  useEffect(() => {
    if (storeData) {
      setStoreCategory(storeData.store_category);
      setAgentId(storeData.agent_id);
      setIsLoading(false);
    }
  }, [storeData]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabOrder[currentIndex - 1]);
      }
    },
    trackTouch: true,
  });

  if (isLoading) return <LoadingSpinner />;

  const getMenuTitle = (storeCategory) => {
    return storeCategory === 'FOOD'
      ? '메뉴'
      : storeCategory === 'RETAIL' || storeCategory === 'UNMANNED'
      ? '상품'
      : '기타';
  };

  const menuTitle = getMenuTitle(storeCategory);

  return (
    <div>
      <div {...handlers} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg relative font-sans" style={{ width: '95%', maxWidth: '450px', height: '95%' }}>
          <StoreBanner banner={storeData.banner} onBack={() => router.push('/mainPage')} isOwner={true} />
          <div className="flex flex-col my-3 pl-4">
            {storeData?.store_name && (
              <p id="storeName" className="font-bold text-3xl" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                {storeData.store_name}
              </p>
            )}
                      {storeData?.store_introduction && (
            <div className="bg-gray-50 rounded-lg p-4 relative">
            <Quote className="text-indigo-500 absolute top-2 left-2" size={20} />
            
            <div
              className={`mt-4 text-gray-600 leading-relaxed ${
                isExpanded ? "max-h-full" : "max-h-16"
              } overflow-hidden transition-all duration-300`}
            >
              <p className="whitespace-pre-line pl-6">{storeData.store_introduction}</p>
            </div>
          
            {storeData.store_introduction.length > 100 && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-indigo-500 font-bold text-lg"></span>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-end w-6"
                >
                  <Triangle
                    size={16}
                    className={`text-indigo-500 transform transition-transform duration-300 ${
                      isExpanded ? "" : "rotate-180"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
          
          )}
          </div>

          <div className="tabs flex justify-around border-b-2 font-medium border-gray-300" style={{ fontFamily: 'NanumSquareExtraBold' }}>
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

          <div className="p-4 font-sans mt-3" style={{ height: 'calc(100vh - 150px)' }}>
            {activeTab === 'home' && <StoreInfo storeData={storeData} />}
            {activeTab === 'menu' && (
              <div className="scrollable-tab-content">
                <MenuList menu={menu} storeCategory={storeCategory} menuTitle={menuTitle} />
              </div>
            )}
            {activeTab === 'image' && (
              <div className="scrollable-tab-content">
                <FeedList images={images} />
              </div>
            )}
          </div>
          {agentId && <Chatbot agentId={agentId} />}
        </div>
      </div>

      <ModalErrorMSG show={showErrorMessageModal} onClose={() => setShowErrorMessageModal(false)}>
        <p style={{ whiteSpace: 'pre-line' }}>
          {typeof errorMessage === 'object' ? (
            Object.entries(errorMessage).map(([key, value]) => (
              <span key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}
                <br />
              </span>
            ))
          ) : (
            errorMessage
          )}
        </p>
      </ModalErrorMSG>

      <style jsx>{`
        html,
        body {
          overflow: hidden; /* 외부 스크롤 제거 */
          height: 100%;
        }
        .scrollable-tab-content {
          overflow-y: auto; /* 세로 스크롤 활성화 */
          height: calc(100vh - 350px); /* 콘텐츠 최대 높이 설정 */
          padding: 16px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default StoreIntroduceOwner;

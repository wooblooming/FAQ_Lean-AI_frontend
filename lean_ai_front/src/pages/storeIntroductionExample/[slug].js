import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import { Quote, Triangle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import StoreBanner from '@/components/ui/storeBanner';
import StoreInfo from '@/components/component/store/storeInfo';
import MenuList from '@/components/component/store/menuList';
import FeedList from '@/components/component/store/feedList';
import { fetchStoreData } from '@/fetch/fetchStoreData';
import { fetchStoreMenu } from '@/fetch/fetchStoreMenu';
import { fetchFeedImage } from '@/fetch/fetchStoreFeed';
import ModalErrorMSG from '@/components/modal/modalErrorMSG';
import Chatbot from '@/pages/chatBotMSG';

const StoreIntroductionExample = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [storeData, setStoreData] = useState(null);
  const [images, setImages] = useState([]);
  const [storeCategory, setStoreCategory] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const tabOrder = ["home", "menu", "image"];
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchStoreData(
        { slug },
        null,
        setStoreData,
        setErrorMessage,
        setShowErrorMessageModal
      );
      fetchStoreMenu(
        { slug },
        null,
        setMenu,
        setErrorMessage,
        setShowErrorMessageModal
      );
      fetchFeedImage({ slug }, null, setImages);
    }
  }, [slug]);

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
    return storeCategory === "FOOD"
      ? "메뉴"
      : storeCategory === "RETAIL" || storeCategory === "UNMANNED"
      ? "상품"
      : "기타";
  };

  const menuTitle = getMenuTitle(storeCategory);

  return (
    <div className="modal-wrapper">
      <div {...handlers} className="modal-content">
        <StoreBanner
          banner={storeData.banner}
          onBack={() => router.push("/")}
          isOwner={true}
        />

        {/* Enhanced store introduction section */}
        <div className="flex flex-col mt-3 px-4">
          {storeData?.store_name && (
            <h1 className="font-bold text-3xl text-gray-800 mb-2">
              {storeData.store_name}
            </h1>
          )}

          {storeData?.store_introduction && (
            <div className="bg-gray-50 rounded-lg p-2 relative">
            <Quote className="text-indigo-500 absolute top-2 left-2" size={18} />
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

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            홈
          </button>
          <button
            className={`tab-btn ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            {menuTitle}
          </button>
          <button
            className={`tab-btn ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            피드
          </button>
        </div>

        <div className="scrollable-tab-content">
          {activeTab === "home" && <StoreInfo storeData={storeData} />}
          {activeTab === "menu" && <MenuList menu={menu} />}
          {activeTab === "image" && <FeedList images={images} />}
        </div>

        {agentId && <Chatbot agentId={agentId} />}
      </div>

      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
      >
        <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
      </ModalErrorMSG>

      <style jsx>{`
        .modal-wrapper {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .modal-content {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 430px;
          height: 95%;
          max-height: 900px;
          overflow: hidden;
          background: white;
          border-radius: 6px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .tabs {
          display: flex;
          justify-content: space-around;
          border-bottom: 2px solid #ccc;
          font-weight: bold;
        }

        .tab-btn {
          padding: 10px 20px;
          flex: 1;
          text-align: center;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          color: #4f46e5;
          font-size: 18px;
          font-weight: bold;
          border-bottom: 4px solid #4f46e5;
        }

        .scrollable-tab-content {
          overflow-y: auto;
          max-height: 50vh;
          padding: 16px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default StoreIntroductionExample;

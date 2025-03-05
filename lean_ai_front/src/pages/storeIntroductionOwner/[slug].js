import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/authContext";
import { useSwipeable } from "react-swipeable";
import {
  Quote,  Triangle,  Home,
  Image as ImageIcon,  CookingPot,
  ShoppingBag,  Package,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import StoreBanner from "@/components/ui/storeBanner";
import StoreInfo from "@/components/component/store/storeInfo";
import MenuList from "@/components/component/store/menuList";
import FeedList from "@/components/component/store/feedList";
import { fetchStoreData } from "@/fetch/fetchStoreData";
import { fetchStoreMenu } from "@/fetch/fetchStoreMenu";
import { fetchFeedImage } from "@/fetch/fetchStoreFeed";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import Chatbot from "../chatBotMSG";

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
  const [activeTab, setActiveTab] = useState("home");
  const tabOrder = ["home", "menu", "image"]; // 탭 순서 배열
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (token && slug) {
      fetchStoreData(
        { slug },
        token,
        setStoreData,
        setErrorMessage,
        setShowErrorMessageModal
      );
      fetchStoreMenu(
        { slug },
        token,
        setMenu,
        setErrorMessage,
        setShowErrorMessageModal
      );
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
    preventDefaultTouchmoveEvent: true,
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

  // Get the appropriate icon based on store category
  const getCategoryIcon = () => {
    switch (storeCategory) {
      case "FOOD":
        return CookingPot;
      case "RETAIL":
        return Package;
      case "UNMANNED":
        return ShoppingBag;
      default:
        return Package;
    }
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div
        {...handlers}
        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl relative overflow-hidden w-[95%] h-[90%] md:min-w-[420px] md:max-w-[30%]" >
          {/* Custom Banner with Back Button */}
          <StoreBanner
            banner={storeData.banner}
            onBack={() => router.push("/mainPage")}
            isOwner={true}
          />

          {/* Tab Navigation */}
          <div className="px-2 bg-white shadow-sm">
            <div className="flex justify-around -mt-6 mb-2 relative z-20">
              <div className="flex space-x-1 bg-white rounded-full p-1 shadow-lg">
                <button
                  className={`flex items-center justify-center space-x-1 py-2 px-4 rounded-full transition-all duration-300 ${
                    activeTab === "home"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("home")}
                >
                  <Home className="h-4 w-4" />
                  <span className="font-medium">홈</span>
                </button>
                <button
                  className={`flex items-center justify-center space-x-1 py-2 px-4 rounded-full transition-all duration-300 ${
                    activeTab === "menu"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("menu")}
                >
                  <CategoryIcon className="h-4 w-4" />
                  <span className="font-medium">{menuTitle}</span>
                </button>
                <button
                  className={`flex items-center justify-center space-x-1 py-2 px-4 rounded-full transition-all duration-300 ${
                    activeTab === "image"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("image")}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="font-medium">피드</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div
            className="py-4 px-4 font-sans"
            style={{ height: "calc(97vh - 300px)", overflowY: "auto" }}
          >
            {activeTab === "home" && (
              <>
                <div className="flex flex-col mb-6 space-y-4">
                  {storeData?.store_name && (
                    <div className="flex items-center justify-between">
                      <h1
                        className="font-bold text-3xl text-gray-800"
                        style={{ fontFamily: "NanumSquareExtraBold" }}
                      >
                        {storeData.store_name}
                      </h1>
                      <div
                        className="px-3 py-1 bg-indigo-50 rounded-full text-indigo-700 font-medium"
                        style={{ fontFamily: "NanumSquareBold" }}
                      >
                        {storeCategory === "FOOD"
                          ? "음식점"
                          : storeCategory === "RETAIL"
                          ? "판매점"
                          : storeCategory === "UNMANNED"
                          ? "무인매장"
                          : "기타"}
                      </div>
                    </div>
                  )}

                  {storeData?.store_introduction && (
                    <div className="bg-gray-50 rounded-lg p-2 relative">
                      <Quote
                        className="text-indigo-500 absolute top-2 left-2"
                        size={18}
                      />
                      <div
                        className={`mt-4 text-gray-600 leading-relaxed ${
                          isExpanded ? "max-h-full" : "max-h-16"
                        } overflow-hidden transition-all duration-300`}
                      >
                        <p className="whitespace-pre-line pl-6">
                          {storeData.store_introduction}
                        </p>
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

                {/* Store Info with styled container */}
                <div className="px-2 py-4 border-t border-gray-200">
                  <StoreInfo storeData={storeData} />
                </div>
              </>
            )}

            {activeTab === "menu" && (
              <div className="">
                <MenuList
                  menu={menu}
                  storeCategory={storeCategory}
                  menuTitle={menuTitle}
                />
              </div>
            )}

            {activeTab === "image" && (
              <div className="">
                <FeedList images={images} storeCategory={storeCategory}/>
              </div>
            )}
          </div>

          {/* Chatbot positioned at the bottom */}
          {agentId && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-2 px-4">
              <Chatbot agentId={agentId} />
            </div>
          )}
        </div>
      </div>

      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
      >
        <p style={{ whiteSpace: "pre-line" }}>
          {typeof errorMessage === "object"
            ? Object.entries(errorMessage).map(([key, value]) => (
                <span key={key}>
                  {key}:{" "}
                  {Array.isArray(value) ? value.join(", ") : value.toString()}
                  <br />
                </span>
              ))
            : errorMessage}
        </p>
      </ModalErrorMSG>

      <style jsx>{`
        html,
        body {
          overflow: hidden;
          height: 100%;
        }

        /* Custom scrollbar */
        div[style*="overflow-y: auto"] {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        div[style*="overflow-y: auto"]::-webkit-scrollbar {
          width: 4px;
        }

        div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
          background: transparent;
        }

        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 6px;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StoreIntroduceOwner;

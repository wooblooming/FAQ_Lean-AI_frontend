import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import StoreBanner from "@/components/ui/storeBanner";
import StoreInfo from "../../components/component/storeInfo";
import MenuList from "../../components/component/menuList";
import FeedList from "../../components/component/feedList";
import { fetchStoreData } from "../../fetch/fetchStoreData";
import { fetchStoreMenu } from "../../fetch/fetchStoreMenu";
import { fetchFeedImage } from "../../fetch/fetchStoreFeed";
import ModalErrorMSG from "../../components/modal/modalErrorMSG";
import Chatbot from "../chatBotMSG";

const StoreIntroduce = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [storeData, setStoreData] = useState(null);
  const [images, setImages] = useState([]);
  const [storeCategory, setStoreCategory] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const tabOrder = ["home", "menu", "image"]; // 탭 순서 배열
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

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
      fetchFeedImage({ slug }, null, setImages); // 피드 가져오기
    }
  }, [slug]);

  useEffect(() => {
    if (storeData) {
      //console.log("store data : ", storeData.store);
      setStoreCategory(storeData.store_category);
      setAgentId(storeData.agent_id);
      setIsLoading(false);
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
    <div>
      <div
        {...handlers}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div
          className="bg-white rounded-lg shadow-lg relative font-sans"
          style={{ width: "95%", maxWidth: "450px", height: "95%" }}
        >
          <StoreBanner
            banner={storeData.banner}
            onBack={() => router.push("/mainPage")}
            isOwner={false}
          />
          <div className="flex flex-col my-3 pl-4">
            {storeData?.store_name && (
              <p
                id="storeName"
                className="font-bold text-3xl"
                style={{ fontFamily: "NanumSquareExtraBold" }}
              >
                {storeData.store_name}
              </p>
            )}
            {storeData?.store_introduction && (
              <p
                className="whitespace-pre-line mt-1"
                style={{ fontFamily: "NanumSquare" }}
              >
                {storeData.store_introduction}
              </p>
            )}
          </div>

          <div
            className="tabs flex justify-around border-b-2 font-medium border-gray-300"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            <button
              className={`p-2 w-1/4 ${
                activeTab === "home"
                  ? "text-indigo-600 text-xl font-bold border-b-4 border-indigo-500"
                  : ""
              }`}
              style={{
                fontFamily:
                  activeTab === "home"
                    ? "NanumSquareExtraBold"
                    : "NanumSquareBold",
              }}
              onClick={() => setActiveTab("home")}
            >
              홈
            </button>
            <button
              className={`p-2 w-1/4 ${
                activeTab === "menu"
                  ? "text-indigo-600 text-xl font-bold border-b-4 border-indigo-500"
                  : ""
              }`}
              style={{
                fontFamily:
                  activeTab === "menu"
                    ? "NanumSquareExtraBold"
                    : "NanumSquareBold",
              }}
              onClick={() => setActiveTab("menu")}
            >
              {menuTitle}
            </button>
            <button
              className={`p-2 w-1/4 ${
                activeTab === "image"
                  ? "text-indigo-600 text-xl font-bold border-b-4 border-indigo-500"
                  : ""
              }`}
              style={{
                fontFamily:
                  activeTab === "image"
                    ? "NanumSquareExtraBold"
                    : "NanumSquareBold",
              }}
              onClick={() => setActiveTab("image")}
            >
              피드
            </button>
          </div>

          <div
            className="p-4 font-sans mt-3"
            style={{ height: "calc(100vh - 150px)" }}
          >
            {activeTab === "home" && <StoreInfo storeData={storeData} />}
            {activeTab === "menu" && (
              <div className="scrollable-tab-content">
                <MenuList
                  menu={menu}
                  storeCategory={storeCategory}
                  menuTitle={menuTitle}
                />
              </div>
            )}
            {activeTab === "image" && (
              <div className="scrollable-tab-content">
                <FeedList images={images} />
              </div>
            )}
          </div>
          {agentId && <Chatbot agentId={agentId} />}
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

export default StoreIntroduce;

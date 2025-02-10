import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../contexts/authContext";
import { useStore } from "../contexts/storeContext";
import { fetchStoreUser } from "../fetch/fetchStoreUser";
import { fetchSubscription } from "../fetch/fetchSubscription";
import SubscriptionInfo from "../components/component/subscriptionInfo";
import PaymentMethod from "../components/component/paymentMethod";
import PaymentHistory from "../components/component/paymentHistory";
import CardCancelModal from "../components/modal/cardCancelModal";
import CardRestoreModal from "../components/modal/cardRestoreModal";
import ModalMSG from "../components/modal/modalMSG";
import ModalErrorMSG from "../components/modal/modalErrorMSG";

const SubscriptionsDashboard = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { storeID } = useStore();
  const [userData, setUserData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [isRestoreOpen, setRestoreOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("구독정보");
  const [isLoading, setIsLoading] = useState(true); // 🔄 로딩 상태 추가

  // 사용자 정보 가져오기
  useEffect(() => {
    if (storeID && token) {
      fetchStoreUser(
        { storeID },
        token,
        setUserData,
        setErrorMessage,
        setShowErrorModal
      );
    }
  }, [storeID, token]);

  // 구독 정보 및 카드 정보 가져오기
  useEffect(() => {
    if (token && userData?.subscription?.id) {
      setIsLoading(true); // 데이터 로딩 시작
      fetchSubscription(
        token,
        userData.subscription.id,
        setSubscriptionData,
        setCardInfo,
        setErrorMessage
      ).finally(() => setIsLoading(false)); // 데이터 로딩 완료
    }
  }, [token, userData]);

  // 성공 모달 닫기
  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  // 에러 모달 닫기
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-violet-50">
      <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg bg-white">
        {/* 헤더 영역 */}
        <div className="flex items-center">
          <ChevronLeft
            className="h-6 w-6 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.push("/mainPage")}
          />
          <h1
            className="text-2xl md:text-3xl font-bold text-center text-indigo-600"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            구독 관리
          </h1>
        </div>

        {/* 로딩 상태 표시 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600 text-lg" style={{ fontFamily: "NanumSquareBold" }}>구독 데이터를 가져오는 중입니다...</p>
          </div>
        ) : (
          <>
            {/* 사이드바 및 콘텐츠 영역 */}
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6">
              {/* 사이드바 (탭 버튼) */}
              <div className="w-full md:w-1/5">
                {["구독정보", "결제수단", "결제내역"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`p-3 w-full text-center md:text-left rounded-lg text-indigo-700 ${
                      selectedTab === tab
                        ? "bg-indigo-100 text-lg md:text-xl"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      fontFamily:
                        selectedTab === tab
                          ? "NanumSquareExtraBold"
                          : "NanumSquareBold",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* 콘텐츠 영역 */}
              <div className="flex-1 bg-white">
                {selectedTab === "구독정보" && (
                  <SubscriptionInfo
                    subscriptionData={subscriptionData}
                    setCancelOpen={setCancelOpen}
                    setRestoreOpen={setRestoreOpen}
                  />
                )}
                {selectedTab === "결제수단" && (
                  <PaymentMethod userData={userData} cardInfo={cardInfo} />
                )}
                {selectedTab === "결제내역" && <PaymentHistory />}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 구독 취소 모달 */}
      <CardCancelModal
        subscriptionData={subscriptionData}
        token={token}
        isOpen={isCancelOpen}
        onClose={() => setCancelOpen(false)}
      />

      {/* 구독 해지 취소 모달 */}
      <CardRestoreModal
        subscriptionData={subscriptionData}
        token={token}
        isOpen={isRestoreOpen}
        onClose={() => setRestoreOpen(false)}
      />

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title="Success"
      >
        {message}
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorModal}
        onClose={handleErrorModalClose}
        title="Error"
      >
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default SubscriptionsDashboard;

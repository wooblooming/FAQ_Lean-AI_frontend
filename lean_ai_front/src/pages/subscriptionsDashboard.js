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
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("구독정보");

  useEffect(() => {
    if (storeID && token) {
      fetchStoreUser({ storeID }, token, setUserData, setErrorMessage, setShowErrorModal);
    }
  }, [storeID, token]);

  useEffect(() => {
    if (token && userData?.billing_key?.id) {
      fetchSubscription(token, userData.billing_key.id, setSubscriptionData, setCardInfo, setErrorMessage);
    }
  }, [token, userData]);

  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-violet-50">
      <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg bg-white">
        <div className="flex items-center">
          <ChevronLeft className="h-6 w-6 text-indigo-700 cursor-pointer mr-2" onClick={() => router.back()} />
          <h1 className="text-xl md:text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: "NanumSquareExtraBold" }}>구독 관리</h1>
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/5">
            {["구독정보", "결제수단", "결제내역"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`p-3 w-full text-center md:text-left rounded-lg text-indigo-700 ${
                  selectedTab === tab ? "bg-indigo-100 text-lg md:text-xl" : "hover:bg-gray-100"
                }`}
                style={{ fontFamily: selectedTab === tab ? "NanumSquareExtraBold" : "NanumSquareBold" }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white">
            {selectedTab === "구독정보" && (
              <SubscriptionInfo subscriptionData={subscriptionData} setCancelOpen={setCancelOpen} />
            )}
            {selectedTab === "결제수단" && <PaymentMethod userData={userData} cardInfo={cardInfo} />}
            {selectedTab === "결제내역" && <PaymentHistory />}
          </div>
        </div>
      </div>

      <CardCancelModal userData={userData} token={token} isOpen={isCancelOpen} onClose={() => setCancelOpen(false)} />
      <ModalMSG show={showMessageModal} onClose={handleMessageModalClose} title="Success">{message}</ModalMSG>
      <ModalErrorMSG show={showErrorModal} onClose={handleErrorModalClose} title="Error">{errorMessage}</ModalErrorMSG>
    </div>
  );
};

export default SubscriptionsDashboard;

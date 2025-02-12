import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { Check } from "lucide-react";
import axios from "axios";
import plans from "/public/text/plan.json";
import { useAuth } from "../contexts/authContext";
import { useStore } from "../contexts/storeContext";
import { fetchStoreUser } from "../fetch/fetchStoreUser";
import ModalMSG from "../components/modal/modalMSG";
import ModalErrorMSG from "../components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

const SubscriptionPlans = () => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  const onClose = () => {
    setShowMessageModal(false);
    setShowErrorModal(false);
    setMessage("");
    setErrorMessage("");
    setSelectedPlan(null);
  };

  const handleSuccessConfirm = () => {
    onClose();
    router.push("/mainPage");
  };

  const handleCancelNavigation = () => {
    router.push("/");
  };

  const mapErrorMessage = (errorMsg) => {
    const errorMessages = {
      "INVALID_CARD_COMPANY": "지원하지 않는 카드사입니다.",
      "INVALID_CARD_NUMBER": "잘못된 카드 번호입니다.",
      "EXPIRED_CARD": "만료된 카드입니다.",
      "INVALID_PIN": "잘못된 비밀번호입니다.",
      "INSUFFICIENT_BALANCE": "잔액이 부족합니다.",
      "EXCEED_MAX_PAYMENT_AMOUNT": "최대 결제금액을 초과했습니다.",
      "INVALID_CARD_EXPIRY": "잘못된 유효기간입니다.",
      "PAY_PROCESS_CANCELED": "결제가 취소되었습니다.",
      "NETWORK_ERROR": "네트워크 오류가 발생했습니다.",
    };
    
    return errorMessages[errorMsg] || "결제 중 오류가 발생했습니다.";
  };

  const requestPayment = async () => {
    if (!window.TossPayments) {
      throw new Error("토스페이먼츠 SDK가 로드되지 않았습니다.");
    }

    const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
    const paymentKey = `payment_${uuidv4()}`;
    const orderID = `${selectedPlan.alias}_${uuidv4().slice(0, 8)}${Date.now().toString(36)}`;

    try {
      // 결제 위젯 실행
      const paymentResponse = await tossPayments.requestPayment('카드', {
        amount: selectedPlan.price,
        orderId: orderID,
        orderName: `${selectedPlan.plan} 구독`,
        customerName: userData?.name || "고객",
        customerEmail: userData?.email,
        successUrl: `${FRONTEND_DOMAIN}/payment/success`,
        failUrl: `${FRONTEND_DOMAIN}/payment/fail`,
        // 빌링키 발급을 위한 설정
        flowMode: 'BILLING',
        useInternationalCardOnly: false
      });

      return paymentResponse;
    } catch (error) {
      console.error('토스 결제 에러:', error);
      throw new Error(error.message);
    }
  };

  const saveSubscription = async (paymentResponse) => {
    try {
      const response = await axios.post(
        `${API_DOMAIN}/api/subscription/`,
        {
          payment_key: paymentResponse.paymentKey,
          billing_key: paymentResponse.billingKey,
          order_id: paymentResponse.orderId,
          plan: selectedPlan.plan,
          price: selectedPlan.price,
          user_id: userData?.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.message;
      } else {
        throw new Error(response.data.error || "구독 등록 실패");
      }
    } catch (error) {
      console.error('구독 저장 에러:', error);
      throw error;
    }
  };

  const handleRegisterClick = async () => {
    if (!selectedPlan) {
      setShowErrorModal(true);
      setErrorMessage("구독 플랜을 선택해주세요.");
      return;
    }

    try {
      const paymentResponse = await requestPayment();
      const successMessage = await saveSubscription(paymentResponse);
      
      setShowMessageModal(true);
      setMessage(successMessage || "정기 결제가 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("결제 오류:", error);
      setShowErrorModal(true);
      setErrorMessage(mapErrorMessage(error.message));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-violet-50  z-50 h-full">
      <div
        className="bg-white rounded-2xl shadow-xl px-6 py-8 md:px-8 
                      w-[95%] h-[95%] md:w-[600px] md:h-[550px] relative animate-in fade-in duration-300 overflow-y-auto"
      >
        {/* 제목 및 설명 */}
        <div className="mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            구독 플랜 선택
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base whitespace-nowrap">
            원하시는 구독 플랜을 선택하고 결제를 진행하세요
          </p>
        </div>

        {/* 구독 플랜 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all h-72 ${
                selectedPlan?.id === plan.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <div className="relative">
                {/* 선택된 플랜 표시 */}
                {selectedPlan?.id === plan.id && (
                  <span className="absolute -top-3 -left-3 bg-indigo-600 text-white p-1 rounded-full">
                    <Check size={16} />
                  </span>
                )}

                {/* 플랜 정보 */}
                <div className="flex flex-col items-center rounded-lg p-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
                    {plan.plan}
                  </h3>
                  <p className="text-lg sm:text-2xl font-bold text-indigo-600 mt-2 text-center">
                    {plan.price.toLocaleString()}원
                    <span className="text-sm text-gray-500 font-normal">
                      /월
                    </span>
                  </p>
                  <p className="text-gray-600 mt-2 text-sm text-center">
                    {plan.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-center">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <Check size={16} className="text-indigo-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={handleCancelNavigation}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-sm sm:text-base"
          >
            취소
          </button>
          <button
            onClick={handleRegisterClick}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors text-sm sm:text-base"
          >
            {selectedPlan
              ? `${selectedPlan.price.toLocaleString()}원 결제하기`
              : "플랜 선택하기"}
          </button>
        </div>
      </div>

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleSuccessConfirm}
        title="Success"
      >
        {message}
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorModal} onClose={onClose}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default SubscriptionPlans;

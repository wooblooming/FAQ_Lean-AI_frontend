import React, { useState } from "react";
import { useRouter } from "next/router";
import { X, Check } from "lucide-react";
import axios from "axios";
import plans from "/public/text/plan.json";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const CardRegistrationModal = ({ userData, token, isOpen, onClose }) => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleSuccessConfirm = () => {
    closeMessageModal();
    onClose();
    router.reload();
  };

  const requestPayment = async (paymentRequest) => {
    return new Promise((resolve, reject) => {
      if (!window.IMP) {
        reject(
          new Error(
            "결제 모듈이 로드되지 않았습니다. 페이지를 새로고침해주세요."
          )
        );
        return;
      }

      window.IMP.init(config.impKey); // ✅ 아임포트 가맹점 코드 초기화 (반드시 필요)
      window.IMP.request_pay(paymentRequest, function (rsp) {
        if (rsp.success) {
          resolve(rsp);
        } else {
          reject(new Error(rsp.error_msg || "결제 요청 실패"));
        }
      });
    });
  };

  const saveBillingKey = async (paymentResponse) => {
    console.log("paymentResponse : ", paymentResponse);

    const response = await axios.post(
      `${config.apiDomain}/api/billing-key-save/`,
      {
        customer_uid: paymentResponse.customer_uid,
        imp_uid: paymentResponse.imp_uid,
        merchant_uid: paymentResponse.merchant_uid,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        user_id: userData.user_id,
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
      throw new Error(response.data.error || "구독 플랜 등록 실패");
    }
  };

  const handleRegisterClick = async () => {
    console.log("register user Data : ", userData);
  
    if (!selectedPlan) {
      setShowErrorModal(true);
      setErrorMessage("구독 플랜을 선택해주세요.");
      return;
    }
  
    const customer_uid = `customer_${userData.user_id}_${new Date().getTime()}`;
    const merchant_uid = `${selectedPlan.name}_${new Date().getTime()}`;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    const paymentRequest = {
      pg: config.pgCode,
      pay_method: "card",
      merchant_uid: merchant_uid,
      customer_uid: customer_uid,
      name: `${selectedPlan.name} 구독 결제`,
      amount: selectedPlan.price,
      buyer_email: userData.email,
      buyer_name: userData.name || "테스트 유저",
      buyer_tel: userData.phone_number || "010-0000-0000",
      m_redirect_url: isMobile ? `${config.frontendDomain}/paymentComplete` : undefined,
    };
  
    try {
      const paymentResponse = await requestPayment(paymentRequest);
      const successMessage = await saveBillingKey(paymentResponse);
  
      setShowMessageModal(true);
      setMessage(successMessage || "정기 결제가 성공적으로 완료되었습니다.");
    } catch (err) {
      console.error("❌ 결제 오류:", err.message);
  
      // 📌 특정 오류 메시지 변환
      let errorMsg = err.message;
  
      if (errorMsg.includes("PAY_PROCESS_CANCELED")) {
        errorMsg = "사용자가 결제를 취소하였습니다.";
      } else if (errorMsg.includes("INVALID_CARD_NUMBER")) {
        errorMsg = "카드 번호를 잘못 입력하셨습니다.";
      } else if (errorMsg.includes("EXPIRED_CARD")) {
        errorMsg = "카드가 만료되었습니다.";
      } else if (errorMsg.includes("INSUFFICIENT_FUNDS")) {
        errorMsg = "잔액이 부족합니다.";
      } else if (errorMsg.includes("CARD_LIMIT_EXCEEDED")) {
        errorMsg = "카드 한도를 초과하였습니다.";
      } else if (errorMsg.includes("NOT_SUPPORTED_CARD_TYPE")) {
        errorMsg = "해당 카드가 지원되지 않습니다. 다른 카드를 이용해주세요.";
      }
  
      setShowErrorModal(true);
      setErrorMessage(errorMsg);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full">
      <div
        className="bg-white rounded-2xl shadow-xl px-6 py-8 md:px-8 
                      w-[95%] h-[95%] md:w-[600px] md:h-[550px] relative animate-in fade-in duration-300 overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            구독 플랜 선택
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base whitespace-nowrap">
            원하시는 구독 플랜을 선택하고 결제를 진행하세요
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan?.id === plan.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {plan.name}
                </h3>
                {selectedPlan?.id === plan.id && (
                  <span className="bg-indigo-600 text-white p-1 rounded-full">
                    <Check size={16} />
                  </span>
                )}
              </div>
              <p className="text-lg sm:text-2xl font-bold text-indigo-600 mt-2">
                {plan.price.toLocaleString()}원
                <span className="text-sm text-gray-500 font-normal">/월</span>
              </p>
              <p className="text-gray-600 mt-2 text-sm">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check size={16} className="text-indigo-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={onClose}
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

      <ModalMSG
        show={showMessageModal}
        onClose={handleSuccessConfirm}
        title="Success"
      >
        {message}
      </ModalMSG>

      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default CardRegistrationModal;

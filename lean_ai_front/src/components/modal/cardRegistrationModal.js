import React, { useState } from "react";
import { X, Check } from "lucide-react";
import axios from "axios";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const CardRegistrationModal = ({ userData, token, isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const plans = [
    {
      id: 1,
      name: "BASIC",
      price: 9900,
      description: "기본 구독",
      features: ["기본 FAQ 챗봇", "기본 분석 기능"],
    },
    {
      id: 2,
      name: "ENTERPRISE",
      price: 500000,
      description: "기업용 구독",
      features: ["CS 응대 챗봇", "사내 챗봇", "고급 분석 기능"],
    },
  ];

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
    window.location.reload();
  };

  const handleRegisterClick = async () => {
    if (!selectedPlan) {
      setShowErrorModal(true);
      setErrorMessage("구독 플랜을 선택해주세요.");
      return;
    }

    try {
      const customer_uid = `customer_${userData.user_id}_${new Date().getTime()}`;
      const merchant_uid = selectedPlan.name + "_" + new Date().getTime();

      let paymentResponse;

      try {
        paymentResponse = await new Promise((resolve, reject) => {
          window.IMP.request_pay(
            {
              pg: config.pgCode,
              pay_method: "card",
              merchant_uid: merchant_uid,
              customer_uid: customer_uid,
              name: `${selectedPlan.name} 구독 결제`,
              amount: selectedPlan.price,
              buyer_email: userData.email,
              buyer_name: userData.name || "테스트 유저",
              buyer_tel: userData.phone_number || "010-0000-0000",
              m_redirect_url: `${config.frontendDomain}/paymentComplete`,
            },
            function (rsp) {
              if (rsp.success) {
                resolve(rsp);
              } else {
                if (rsp.error_msg.includes("PAY_PROCESS_CANCELED")) {
                  onClose();
                  return;
                }
                reject(new Error(rsp.error_msg || "결제 요청 실패"));
              }
            }
          );
        });
      } catch (err) {
        console.error("결제 요청 실패:", err.message);
        setShowErrorModal(true);
        setErrorMessage(err.response?.data?.message || "알 수 없는 오류가 발생했습니다.");
        return;
      }

      try {
        const response = await axios.post(
          `${config.apiDomain}/api/billing-key-save/`,
          {
            customer_uid: customer_uid,
            imp_uid: paymentResponse.imp_uid,
            merchant_uid: paymentResponse.merchant_uid,
            plan: selectedPlan.name,
            user_id: userData.user_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (data.success) {
          setShowMessageModal(true);
          setMessage(
            data.message || "결제가 성공적으로 완료되었습니다. 정기 결제가 활성화되었습니다."
          );
        } else {
          throw new Error(data.error || "구독 플랜 등록 실패");
        }
      } catch (err) {
        console.error("Billing Key 등록 및 결제 실패:", err.message);
        setShowErrorModal(true);
        const errorMsg =
          err.response?.data?.message ||
          "서버 요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        setErrorMessage(errorMsg);
        return;
      }
    } catch (error) {
      console.error("알 수 없는 오류 발생:", error.message);
      setShowErrorModal(true);
      setErrorMessage(
        "시스템 오류가 발생했습니다. 문제가 계속되면 관리자에게 문의하세요."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full">
      <div className="bg-white rounded-2xl shadow-xl px-6 py-8 md:px-8 
                      w-[95%] h-[95%] md:w-[600px] md:h-[550px] relative animate-in fade-in duration-300 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">구독 플랜 선택</h2>
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
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{plan.name}</h3>
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

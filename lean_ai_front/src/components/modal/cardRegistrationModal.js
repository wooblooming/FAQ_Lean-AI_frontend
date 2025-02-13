import React, { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { X, Check } from "lucide-react";
import axios from "axios";
import plans from "/public/text/plan.json";
import SubscriptionRulesModal from "./subscriptionRulesModal";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
const SITE_CD = process.env.NEXT_PUBLIC_KCP_SITE_CD;

const CardRegistrationModal = ({ userData, token, isOpen, onClose }) => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null); // 선택된 플랜
  const [isPolicyConfirmed, setIsPolicyConfirmed] = useState(false); // ✅ 교환/환불 규정 확인 여부
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [message, setMessage] = useState(""); // 성공 메시지
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
  const [showMessageModal, setShowMessageModal] = useState(false); // 성공 모달 표시 여부
  const [showErrorModal, setShowErrorModal] = useState(false); // 에러 모달 표시 여부

  // 결제 버튼 활성화 조건
  const isPaymentEnabled = selectedPlan && isPolicyConfirmed;

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setSelectedPlan(false);
    setIsPolicyConfirmed(false);
    setMessage("");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);  // 선택된 플랜 초기화
    setIsPolicyConfirmed(false); // 교환/환불 규정 확인 상태 초기화
    onClose(); // 기존 모달 닫기 기능 실행
  };

  const handleSuccessConfirm = () => {
    closeMessageModal();
    onClose();
    router.reload();
  };

  const handleOpenPolicyModal = () => {
    setShowChangeModal(true);
  };

  const handleClosePolicyModal = () => {
    setShowChangeModal(false);
    setIsPolicyConfirmed(true);
  };

  const handleRegisterClick = async () => {
    if (!selectedPlan) {
      setShowErrorModal(true);
      setErrorMessage("구독 플랜을 선택해주세요.");
      return;
    }

    if (!isPolicyConfirmed) {
      setShowErrorModal(true);
      setErrorMessage("구독 규정을 먼저 확인해주세요.");
      return;
    }

    try {
      const paymentResponse = await requestKCPSubscriptionPayment();
      console.log("정기 결제 성공:", paymentResponse);

      const successMessage = await saveSubscription(paymentResponse);
      setShowMessageModal(true);
      setMessage(successMessage || "정기 결제가 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("결제 오류:", error);
      setShowErrorModal(true);
      setErrorMessage(error.message || "결제 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full">
      <div
        className="bg-white rounded-2xl shadow-xl px-6 py-8 md:px-8 
                      w-[95%] h-[95%] md:w-[600px] md:h-[600px] relative animate-in fade-in duration-300 overflow-y-auto"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

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
                {selectedPlan?.id === plan.id && (
                  <span className="absolute -top-3 -left-3 bg-indigo-600 text-white p-1 rounded-full">
                    <Check size={16} />
                  </span>
                )}
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

        {/* 교환 및 환불 규정 보기 */}
        <div className="flex items-center justify-center space-x-2">
          <Check className="text-red-500" />
          <button
            onClick={handleOpenPolicyModal}
            className="text-lg font-semibold underline hover:text-indigo-600"
          >
            <span>교환 및 환불 규정 보기</span>
          </button>
        </div>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={handleCloseModal}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-sm sm:text-base"
            style={{ fontFamily: "NanumSquareBold" }}
          >
            취소
          </button>
          <button
            onClick={handleRegisterClick}
            disabled={!isPaymentEnabled} // ✅ 플랜과 환불정책 모두 선택해야 활성화됨
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
              isPaymentEnabled
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            style={{ fontFamily: "NanumSquareBold" }}
          >
            {selectedPlan
              ? `${selectedPlan.price.toLocaleString()}원 결제하기`
              : "플랜 선택하기"}
          </button>
        </div>
      </div>

      {/* 교환,환불 모달 */}
      <SubscriptionRulesModal
        show={showChangeModal}
        onClose={handleClosePolicyModal}
      />

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleSuccessConfirm}
        title="Success"
      >
        {message}
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default CardRegistrationModal;

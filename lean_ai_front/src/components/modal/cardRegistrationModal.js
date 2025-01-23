import React, { useState } from "react";
import { X, Check } from "lucide-react"; 
import axios from "axios"; 
import ModalMSG from "./modalMSG"; 
import ModalErrorMSG from "./modalErrorMSG"; 
import config from "../../../config"; 

const CardRegistrationModal = ({ userData, token, isOpen, onClose }) => {
  // 상태 관리
  const [selectedPlan, setSelectedPlan] = useState(null); // 선택된 구독 플랜
  const [message, setMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showMessageModal, setShowMessageModal] = useState(false); 
  const [showErrorModal, setShowErrorModal] = useState(false); 

  // 구독 플랜 목록
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

  // 성공 메시지 모달 닫기
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  // 에러 메시지 모달 닫기
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  // 성공 메시지 확인 시 동작
  const handleSuccessConfirm = () => {
    closeMessageModal(); // 성공 메시지 모달 닫기
    onClose(); // 카드 등록 모달 닫기
    window.location.reload(); // 페이지 리로드
  };

  // 구독 결제 처리 함수
  const handleRegisterClick = async () => {
    // 구독 플랜 선택 여부 확인
    if (!selectedPlan) {
      setShowErrorModal(true);
      setErrorMessage("구독 플랜을 선택해주세요.");
      return;
    }

    try {
      const customer_uid = `customer_${userData.user_id}_${new Date().getTime()}`; // 고유 고객 ID 생성
      const merchant_uid = selectedPlan.name + "_" + new Date().getTime(); // 고유 주문 ID 생성

      let paymentResponse;

      // 1. 결제 요청 (PG를 통해 최초 결제 진행)
      try {
        paymentResponse = await new Promise((resolve, reject) => {
          window.IMP.request_pay(
            {
              pg: config.pgCode, // PG사 코드
              pay_method: "card", // 결제 방식
              merchant_uid: merchant_uid, // 주문 ID
              customer_uid: customer_uid, // 고유 고객 ID
              name: `${selectedPlan.name} 구독 결제`, // 결제명
              amount: selectedPlan.price, // 결제 금액
              buyer_email: userData.email, // 구매자 이메일
              buyer_name: userData.name || "테스트 유저", // 구매자 이름
              buyer_tel: userData.phone_number || "010-0000-0000", // 구매자 전화번호
            },
            function (rsp) {
              if (rsp.success) {
                resolve(rsp); // 성공 시 Promise 해제
              } else {
                // 사용자가 결제를 취소한 경우 처리
                if (rsp.error_msg.includes("PAY_PROCESS_CANCELED")) {
                  onClose(); // 모달 닫기
                  return; // 진행 중단
                }
                reject(new Error(rsp.error_msg || "결제 요청 실패"));
              }
            }
          );
        });
      } catch (err) {
        // 결제 요청 실패 처리
        console.error("결제 요청 실패:", err.message);
        setShowErrorModal(true);
        setErrorMessage(err.response?.data?.message || "알 수 없는 오류가 발생했습니다.");
        return;
      }

      // 2. Billing Key 및 결제 등록
      try {
        const response = await axios.post(
          `${config.apiDomain}/api/billing-key-save/`, // Billing Key 저장 API
          {
            customer_uid: customer_uid, // 고유 빌링키 ID
            imp_uid: paymentResponse.imp_uid, // 결제 고유 ID
            merchant_uid: paymentResponse.merchant_uid, // 주문 ID
            plan: selectedPlan.name, // 선택된 구독 플랜
            user_id: userData.user_id, // 사용자 ID
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 토큰
            },
          }
        );

        const data = response.data;

        if (data.success) {
          setShowMessageModal(true); // 성공 메시지 모달 표시
          setMessage(
            data.message || "결제가 성공적으로 완료되었습니다. 정기 결제가 활성화되었습니다."
          );
        } else {
          throw new Error(data.error || "구독 플랜 등록 실패");
        }
      } catch (err) {
        // Billing Key 등록 실패 처리
        console.error("Billing Key 등록 및 결제 실패:", err.message);
        setShowErrorModal(true);
        const errorMsg =
          err.response?.data?.message ||
          "서버 요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        setErrorMessage(errorMsg);
        return;
      }
    } catch (error) {
      // 알 수 없는 오류 처리
      console.error("알 수 없는 오류 발생:", error.message);
      setShowErrorModal(true);
      setErrorMessage(
        "시스템 오류가 발생했습니다. 문제가 계속되면 관리자에게 문의하세요."
      );
    }
  };

  // 모달이 닫혀 있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* 모달 본문 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[600px] relative animate-in fade-in duration-300">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* 제목 및 설명 */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">구독 플랜 선택</h2>
          <p className="text-gray-500 mt-2">
            원하시는 구독 플랜을 선택하고 결제를 진행하세요
          </p>
        </div>

        {/* 플랜 목록 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)} // 선택된 플랜 설정
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan?.id === plan.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                {selectedPlan?.id === plan.id && (
                  <span className="bg-indigo-600 text-white p-1 rounded-full">
                    <Check size={16} />
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-indigo-600 mt-2">
                {plan.price.toLocaleString()}원
                <span className="text-sm text-gray-500 font-normal">/월</span>
              </p>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <Check size={16} className="text-indigo-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleRegisterClick}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
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
      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default CardRegistrationModal;

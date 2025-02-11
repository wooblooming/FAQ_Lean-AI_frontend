import React, { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { X, Check } from "lucide-react";
import axios from "axios";
import plans from "/public/text/plan.json"; // ✅ 구독 플랜 데이터 JSON 파일
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
const PG_CODE = process.env.NEXT_PUBLIC_PG_CODE;
const IMP_KEY = process.env.NEXT_PUBLIC_IMP_KEY;

const CardRegistrationModal = ({ userData, token, isOpen, onClose }) => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null); // 선택된 플랜
  const [message, setMessage] = useState(""); // 성공 메시지
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
  const [showMessageModal, setShowMessageModal] = useState(false); // 성공 모달 표시 여부
  const [showErrorModal, setShowErrorModal] = useState(false); // 에러 모달 표시 여부

  // 성공 모달 닫기
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  // 에러 모달 닫기
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  // 성공 모달 확인 클릭 시 동작
  const handleSuccessConfirm = () => {
    closeMessageModal();
    onClose();
    router.reload(); // 페이지 새로고침
  };

  // 오류 메시지 매핑
  const mapErrorMessage = (errorMsg) => {
    if (errorMsg.includes("PAY_PROCESS_CANCELED")) {
      return "사용자가 결제를 취소하였습니다.";
    } else if (errorMsg.includes("INVALID_CARD_NUMBER")) {
      return "카드 번호를 잘못 입력하셨습니다.";
    } else if (errorMsg.includes("EXPIRED_CARD")) {
      return "카드가 만료되었습니다.";
    } else if (errorMsg.includes("INSUFFICIENT_FUNDS")) {
      return "잔액이 부족합니다.";
    } else if (errorMsg.includes("CARD_LIMIT_EXCEEDED")) {
      return "카드 한도를 초과하였습니다.";
    } else if (errorMsg.includes("NOT_SUPPORTED_CARD_TYPE")) {
      return "해당 카드가 지원되지 않습니다. 다른 카드를 이용해주세요.";
    } else if (errorMsg.includes("ACQUIRER_ERROR")) {
      return "카드사 승인에 실패했습니다. 다른 카드를 사용해 주세요.";
    } else if (errorMsg.includes("NETWORK_ERROR")) {
      return "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    } else if (errorMsg.includes("SERVER_ERROR")) {
      return "결제 서버 오류가 발생했습니다. 고객센터로 문의하세요.";
    }
    return errorMsg;
  };

  // 결제 요청 함수
  const requestPayment = async (paymentRequest) => {
    return new Promise((resolve, reject) => {
      if (!window.IMP) {
        // 아임포트 객체가 없는 경우 에러
        reject(
          new Error(
            "결제 모듈이 로드되지 않았습니다. 페이지를 새로고침해주세요."
          )
        );
        return;
      }

      // 아임포트 초기화
      window.IMP.init(IMP_KEY);

      // 결제 요청
      window.IMP.request_pay(paymentRequest, function (rsp) {
        if (rsp.success) {
          // 결제 성공
          resolve(rsp);
        } else {
          // 결제 실패
          reject(new Error(rsp.error_msg || "결제 요청 실패"));
        }
      });
    });
  };

  // BillingKey 저장 요청 함수
  const saveBillingKey = async (paymentResponse) => {
    //console.log("paymentResponse : ", paymentResponse);

    // API 요청
    const response = await axios.post(
      `${API_DOMAIN}/api/subscription/`, // 서버의 구독 신청 API
      {
        customer_uid: paymentResponse.customer_uid, // 아임포트에서 반환된 고객 UID
        imp_uid: paymentResponse.imp_uid, // 아임포트에서 반환된 결제 고유 ID
        merchant_uid: paymentResponse.merchant_uid, // 주문 고유 ID
        plan: selectedPlan.plan, // 선택한 플랜 이름
        price: selectedPlan.price, // 선택한 플랜 가격
        user_id: userData.user_id, // 사용자 ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰
        },
      }
    );

    if (response.data.success) {
      return response.data.message; // 성공 메시지 반환
    } else {
      throw new Error(response.data.error || "구독 플랜 등록 실패");
    }
  };

  // "결제하기" 버튼 클릭 핸들러
  const handleRegisterClick = async () => {
    if (!selectedPlan) {
      // 선택된 플랜이 없을 경우 에러 처리
      setShowErrorModal(true);
      setErrorMessage("구독 플랜을 선택해주세요.");
      return;
    }

    // 고객 UID와 주문 UID 생성
    const customer_uid = `customer_${uuidv4().slice(0, 8)}`;
    const merchant_uid = `${selectedPlan.alias}_${uuidv4().slice(
      0,
      8
    )}${Date.now().toString(36)}`;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent); // 모바일 여부 확인

    // 결제 요청 데이터
    const paymentRequest = {
      pg: PG_CODE, // PG사 설정 (예: kakaopay, tosspay)
      pay_method: "card", // 결제 방식
      merchant_uid: merchant_uid, // 주문 번호
      customer_uid: customer_uid, // 고객 UID
      name: `${selectedPlan.plan} 구독 결제`, // 결제 이름
      amount: selectedPlan.price, // 결제 금액
      buyer_email: userData.email, // 사용자 이메일
      buyer_name: userData.name || "테스트 유저", // 사용자 이름
      buyer_tel: userData.phone_number || "010-0000-0000", // 사용자 전화번호
      m_redirect_url: isMobile
        ? `${FRONTEND_DOMAIN}/subPaymentComplete` // 모바일 리디렉션 URL
        : undefined,
    };

    try {
      // 결제 요청
      const paymentResponse = await requestPayment(paymentRequest);

      // BillingKey 저장
      const successMessage = await saveBillingKey(paymentResponse);

      // 성공 메시지 표시
      setShowMessageModal(true);
      setMessage(successMessage || "정기 결제가 성공적으로 완료되었습니다.");
    } catch (err) {
      console.error("❌ 결제 오류:", err.message);
      setShowErrorModal(true);
      setErrorMessage(mapErrorMessage(err.message));
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full">
      <div
        className="bg-white rounded-2xl shadow-xl px-6 py-8 md:px-8 
                      w-[95%] h-[95%] md:w-[600px] md:h-[550px] relative animate-in fade-in duration-300 overflow-y-auto"
      >
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

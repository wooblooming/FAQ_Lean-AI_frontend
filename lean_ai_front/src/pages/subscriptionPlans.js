import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { Check } from "lucide-react";
import axios from "axios";
import plans from "/public/text/plan.json";
import { useAuth } from "../contexts/authContext";
import { useStore } from "../contexts/storeContext";
import { fetchStoreUser } from "../fetch/fetchStoreUser";
import SubscriptionRulesModal from "../components/modal/subscriptionRulesModal";
import ModalMSG from "../components/modal/modalMSG";
import ModalErrorMSG from "../components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
const SITE_CD = process.env.NEXT_PUBLIC_KCP_SITE_CD;

const SubscriptionPlans = () => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPolicyConfirmed, setIsPolicyConfirmed] = useState(false); // ✅ 모달 확인 상태 추가
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

   // 결제 버튼 활성화 조건
   const isPaymentEnabled = selectedPlan && isPolicyConfirmed;

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

  const handleOpenPolicyModal = () => {
    setShowChangeModal(true);
  };

  const handleClosePolicyModal = () => {
    setShowChangeModal(false);
    setIsPolicyConfirmed(true); // ✅ 모달을 닫을 때 확인 상태 변경
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
      // 1️⃣ KCP 정기결제 요청 (한 번에 결제 + 빌링키 발급)
      const paymentResponse = await requestKCPSubscriptionPayment();
      console.log("정기 결제 성공:", paymentResponse);

      // 2️⃣ 빌링키를 백엔드에 저장하여 구독 등록
      const successMessage = await saveSubscription(paymentResponse);

      setShowMessageModal(true);
      setMessage(successMessage || "정기 결제가 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("결제 오류:", error);
      setShowErrorModal(true);
      setErrorMessage(error.message || "결제 중 오류가 발생했습니다.");
    }
  };

  const requestKCPSubscriptionPayment = async () => {
    return new Promise((resolve, reject) => {
      if (!window.KCP_Pay_Execute_Web) {
        reject(new Error("KCP 결제 모듈이 로드되지 않았습니다."));
        return;
      }

      const orderInfo = {
        site_cd: SITE_CD, // 테스트용 Site Code (운영에서는 실제 코드 사용)
        pay_method: "100000000000", // 신용카드
        currency: "410", // KRW
        approval_key: "",
        good_name: selectedPlan?.plan || "구독 플랜",
        good_mny: selectedPlan?.price.toString() || "0",
        buyr_name: userData?.name || "사용자",
        buyr_mail: userData?.email || "test@test.com",
        buyr_tel1: userData?.phone || "010-0000-0000",
        ordr_idxx: uuidv4().replace(/-/g, "").substring(0, 20), // 랜덤 주문번호 생성
        escrow_yn: "N", // 에스크로 사용 여부 (정기 결제에서는 "N"으로 설정)
        pay_type: "P", // 🔥 정기결제 (자동결제) 모드 활성화
        Ret_URL: `${FRONTEND_DOMAIN}/subscription`, // 현재 페이지에서 처리
      };

      // 🔥 KCP 정기 결제 요청
      window.KCP_Pay_Execute_Web(orderInfo, (response) => {
        if (response.res_cd === "0000") {
          console.log("정기 결제 성공, 빌링키 발급 완료:", response);
          resolve(response);
        } else {
          reject(new Error(response.res_msg || "정기 결제 실패"));
        }
      });
    });
  };

  const saveSubscription = async (paymentResponse) => {
    try {
      const response = await axios.post(
        `${API_DOMAIN}/api/subscription/`,
        {
          store_id: storeID,
          user_email: userData?.email,
          plan_id: selectedPlan?.id,
          payment_method: "KCP",
          billing_key: paymentResponse.card_cd, // 🔥 정기결제 빌링키 (KCP 응답에서 가져옴)
          payment_status: "success",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        return "정기 결제가 정상적으로 등록되었습니다.";
      } else {
        throw new Error("구독 등록 실패");
      }
    } catch (error) {
      console.error("구독 저장 실패:", error);
      throw error;
    }
  };

  // 에러 메시지 매핑 함수에 KCP 관련 에러 추가
  const mapErrorMessage = (errorMsg) => {
    const errorMessages = {
      INVALID_CARD_COMPANY: "지원하지 않는 카드사입니다.",
      INVALID_CARD_NUMBER: "잘못된 카드 번호입니다.",
      EXPIRED_CARD: "만료된 카드입니다.",
      INVALID_PIN: "잘못된 비밀번호입니다.",
      INSUFFICIENT_BALANCE: "잔액이 부족합니다.",
      EXCEED_MAX_PAYMENT_AMOUNT: "최대 결제금액을 초과했습니다.",
      INVALID_CARD_EXPIRY: "잘못된 유효기간입니다.",
      PAY_PROCESS_CANCELED: "결제가 취소되었습니다.",
      NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
      KCP_SCRIPT_NOT_LOADED:
        "결제 모듈 로딩에 실패했습니다. 페이지를 새로고침해주세요.",
    };

    return errorMessages[errorMsg] || "결제 중 오류가 발생했습니다.";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-violet-50  z-50 h-full">
      <div
        className="bg-white rounded-2xl shadow-xl px-6 py-8 md:px-8 
                      w-[95%] h-[95%] md:w-[600px] md:h-[600px] relative animate-in fade-in duration-300 overflow-y-auto"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
            onClick={handleCancelNavigation}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-sm sm:text-base"
          >
            취소
          </button>
          <button
            onClick={handleRegisterClick}
            disabled={!isPaymentEnabled} // ✅ 모달 확인 전까지 버튼 비활성화
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              isPaymentEnabled
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
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
      <ModalErrorMSG show={showErrorModal} onClose={onClose}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default SubscriptionPlans;

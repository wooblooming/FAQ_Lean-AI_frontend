import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
const SITE_CD = process.env.NEXT_PUBLIC_KCP_SITE_CD;
const TEST_CD = process.env.NEXT_PUBLIC_KCP_TEST_SITE_CD;

const SubscriptionPlans = () => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPolicyConfirmed, setIsPolicyConfirmed] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
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

  const handleOpenPolicyModal = () => {
    setShowChangeModal(true);
  };

  const handleClosePolicyModal = () => {
    setShowChangeModal(false);
    setIsPolicyConfirmed(true);
  };

  const isPaymentEnabled = selectedPlan && isPolicyConfirmed;

  /** ✅ KCP 결제창 호출 함수 */
  const handlePayment = () => {
    console.log("현재 사용 중인 KCP site_cd:", TEST_CD);
    console.log("KCP 결제 모듈 확인:", window.KCP_Pay_Execute_Web);

    if (!window.KCP_Pay_Execute_Web) {
      reject(new Error("KCP 결제 모듈이 로드되지 않았습니다."));
      return;
    }

    const orderId = `ORDER-${Date.now()}`;

    // 결제창에 전달할 form 생성
    const form = document.createElement("form");
    form.name = "order_info";
    form.method = "post";
    form.action = `${API_DOMAIN}/api/kcp-approval`; // Ret_URL에서 승인 처리

    const paymentData = {
      site_cd: TEST_CD,
      card_cert_type: "BATCH",
      site_name: "TEST SITE",
      pay_method: "AUTH:CARD",
      kcpgroup_id: "",
      ordr_idxx: orderId,
      good_expr: "2:1m",
      batch_soc: "Y",
      module_type: "01",
      buyr_name: userData?.name || "홍길동",
    };

    console.log("paymentData :", paymentData);

    Object.keys(paymentData).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = paymentData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    KCP_Pay_Execute_Web(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-violet-50 z-50 h-full">
      <div className="bg-white rounded-2xl shadow-xl px-6 py-8 md:px-8 w-[95%] h-[95%] md:w-[600px] md:h-[600px] relative animate-in fade-in duration-300 overflow-y-auto">
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
            onClick={handlePayment}
            disabled={!isPaymentEnabled}
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

      {/* 모달 컴포넌트들 */}
      <SubscriptionRulesModal
        show={showChangeModal}
        onClose={handleClosePolicyModal}
      />
      <ModalMSG
        show={showMessageModal}
        onClose={handleSuccessConfirm}
        title="Success"
      >
        {message}
      </ModalMSG>
      <ModalErrorMSG show={showErrorModal} onClose={onClose}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default SubscriptionPlans;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import ModalMSG from "../components/modal/modalMSG";
import ModalErrorMSG from "../components/modal/modalErrorMSG";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import config from "../../config";

const PaymentComplete = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
    router.push("/mainPage"); // 결제 성공 후 이동
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    router.push("/mainPage"); // 에러 발생 시에도 마이페이지로 이동
  };

  // 빌링키 저장 함수 추가
  const saveBillingKey = async (paymentData) => {
    // console.log("결제 성공:", paymentData);
    try {
      const response = await axios.post(
        `${config.apiDomain}/api/subscription/`,
        {
          customer_uid: paymentData.customer_uid,
          imp_uid: paymentData.imp_uid,
          merchant_uid: paymentData.merchant_uid,
          plan: paymentData.plan, // 플랜 정보 전달
          price: paymentData.price, // 결제 금액 전달
          user_id: paymentData.user_id, // 유저 ID 전달
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
    } catch (err) {
      console.error("BillingKey 저장 오류:", err.message);
      throw new Error("BillingKey 저장 실패: " + err.message);
    }
  };

  useEffect(() => {
    const handlePaymentResult = async () => {
      const { imp_uid, success, error_msg } = router.query;

      if (!imp_uid) {
        setErrorMessage("결제 정보가 누락되었습니다.");
        setShowErrorModal(true);
        return;
      }

      if (success === "false") {
        setErrorMessage(error_msg || "결제 실패");
        setShowErrorModal(true);
        return;
      }

      try {
        // 1️. 결제 완료 API 호출
        const response = await axios.post(
          `${config.apiDomain}/api/payment-complete/`,
          { imp_uid }, // 백엔드에 imp_uid만 전달
          { headers: { Authorization: `Bearer ${token}` } } // 인증 토큰
        );

        if (response.data.success) {
          const paymentData = response.data.payment_data;

          // 2️. 빌링키 저장 API 호출
          const billingKeyMessage = await saveBillingKey({
            customer_uid: paymentData.customer_uid,
            imp_uid: paymentData.imp_uid,
            merchant_uid: paymentData.merchant_uid,
            plan: paymentData.plan,
            price: paymentData.price,
            user_id: paymentData.user_id,
          });

          setMessage("구독 신청이 성공적으로 완료되었습니다." || billingKeyMessage);
          setShowMessageModal(true);
        } else {
          throw new Error(response.data.error || "결제 처리 실패");
        }
      } catch (error) {
        console.error("Error during payment process:", error.message);
        setErrorMessage("결제 처리 중 문제가 발생했습니다.");
        setShowErrorModal(true);
      }
    };

    if (router.isReady) {
      handlePaymentResult();
    }
  }, [router.isReady]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <LoadingSpinner />

      <ModalMSG
        show={showMessageModal}
        onClose={closeMessageModal}
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

export default PaymentComplete;

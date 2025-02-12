import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import ModalMSG from "../components/modal/modalMSG";
import ModalErrorMSG from "../components/modal/modalErrorMSG";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const PaymentComplete = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { paymentKey, orderId, amount, customerKey } = router.query;
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

  useEffect(() => {
    const completePaymentAndBilling = async () => {
      try {
        // 1. 결제 승인 및 빌링키 발급 요청
        const response = await axios.post(
          `${API_DOMAIN}/api/payment/complete`,
          {
            paymentKey,
            orderId,
            amount,
            customerKey,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // 성공 시 메인 페이지로 리다이렉트
          router.replace("/mainPage");
        } else {
          // 실패 시 에러 페이지로 리다이렉트
          router.replace("/payment/fail");
        }
      } catch (error) {
        console.error("결제 완료 실패:", error);
        router.replace("/payment/fail");
      }
    };

    // 쿼리 파라미터가 모두 있을 때만 실행
    if (paymentKey && orderId && amount && customerKey && token) {
      completePaymentAndBilling();
    }
  }, [paymentKey, orderId, amount, customerKey, token, router]);

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

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "@/contexts/authContext";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const PaymentChangeCard = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
    router.push("/subscriptionsDashboard"); // 카드 변경 성공 후 구독 관리 페이지로 이동
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    router.push("/subscriptionsDashboard"); // 에러 발생 시에도 구독 관리 페이지로 이동
  };

  useEffect(() => {
    const handleCardChangeResult = async () => {
      const { imp_uid, success, error_msg } = router.query;

      if (!imp_uid) {
        setErrorMessage("카드 변경 정보가 누락되었습니다.");
        setShowErrorModal(true);
        return;
      }

      if (success === "false") {
        setErrorMessage(error_msg || "카드 변경 실패");
        setShowErrorModal(true);
        return;
      }

      try {
        // imp_uid로 백엔드에 요청하여 customer_uid 조회
        const response = await axios.post(
          `${API_DOMAIN}/api/payment-change-complete/`,
          { imp_uid },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "customer_uid 조회 실패");
        }

        const customer_uid = response.data.customer_uid;

        // customer_uid를 이용하여 BillingKey 변경 API 호출
        await updateBillingKey(imp_uid, customer_uid);

        setMessage("카드가 성공적으로 변경되었습니다.");
        setShowMessageModal(true);
      } catch (error) {
        console.error("❌ 카드 변경 처리 중 오류 발생:", error.message);
        setErrorMessage("카드 변경 처리 중 문제가 발생했습니다.");
        setShowErrorModal(true);
      }
    };

    if (router.isReady) {
      handleCardChangeResult();
    }
  }, [router.isReady]);

  // BillingKey 변경 API 요청
  const updateBillingKey = async (imp_uid, newCustomerUid) => {
    try {
      const response = await axios.post(
        `${API_DOMAIN}/api/subscription/update_billing_key/`,
        { customer_uid: newCustomerUid, imp_uid: imp_uid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "BillingKey 변경 실패");
      }

      //console.log("BillingKey 변경 성공:", response.data);
    } catch (error) {
      console.error(
        "❌ BillingKey 변경 실패:",
        error.response?.data || error.message
      );
      throw new Error("BillingKey 변경 중 오류가 발생했습니다.");
    }
  };

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

export default PaymentChangeCard;

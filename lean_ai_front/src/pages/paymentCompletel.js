import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import ModalMSG from "../components/modal/modalMSG";
import ModalErrorMSG from "../components/modal/modalErrorMSG";
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
    router.push("/myPage"); // 결제 성공 후 이동
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    router.push("/"); // 에러 발생 시 메인 페이지로 이동
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
        const response = await axios.post(
          `${config.apiDomain}/api/payment-complete/`,
          { imp_uid }, // 백엔드에 imp_uid만 전달
          { headers: { Authorization: `Bearer ${token}` } } // 인증 토큰
        );
    
        if (response.data.success) {
          setMessage("결제가 성공적으로 완료되었습니다.");
          setShowMessageModal(true);
        } else {
          throw new Error(response.data.error || "결제 처리 실패");
        }
      } catch (error) {
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
      <h1 className="text-xl font-bold text-gray-800">결제 처리 중...</h1>

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

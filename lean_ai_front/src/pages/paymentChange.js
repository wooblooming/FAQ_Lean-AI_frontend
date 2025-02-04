import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import ModalMSG from "../components/modal/modalMSG";
import ModalErrorMSG from "../components/modal/modalErrorMSG";
import config from "../../config";

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
    router.push("/myPage"); // 카드 변경 성공 후 마이페이지로 이동
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    router.push("/myPage"); // 에러 발생 시에도 마이페이지로 이동
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
        // 카드 변경 완료 API 호출
        const response = await axios.post(
          `${config.apiDomain}/api/payment-change-complete/`,
          { imp_uid },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setMessage("카드가 성공적으로 변경되었습니다.");
          setShowMessageModal(true);
        } else {
          throw new Error(response.data.error || "카드 변경 처리 실패");
        }
      } catch (error) {
        console.error("Error during card change process:", error.message);
        setErrorMessage("카드 변경 처리 중 문제가 발생했습니다.");
        setShowErrorModal(true);
      }
    };

    if (router.isReady) {
      handleCardChangeResult();
    }
  }, [router.isReady]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-xl font-bold text-gray-800">카드 변경 처리 중...</h1>

      <ModalMSG show={showMessageModal} onClose={closeMessageModal} title="Success">
        {message}
      </ModalMSG>

      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default PaymentChangeCard;
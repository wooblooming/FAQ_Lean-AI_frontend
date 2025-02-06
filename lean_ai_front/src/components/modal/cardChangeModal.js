import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const CardChangeModal = ({ userData, isOpen, onClose }) => {
  const { token } = useAuth();
  const [message, setMessage] = useState(""); // 성공 메시지
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  // 성공 메시지 확인 시 동작 (카드 변경 완료 후)
  const handleSuccessConfirm = () => {
    closeMessageModal();
    onClose();
    window.location.reload();
  };

  // 결제 요청 함수
  const requestPayment = async (paymentRequest) => {
    return new Promise((resolve, reject) => {
      if (!window.IMP) {
        reject(
          new Error(
            "PortOne 결제 모듈이 로드되지 않았습니다. 페이지를 새로고침해주세요."
          )
        );
        return;
      }

      window.IMP.init(config.impKey);

      window.IMP.request_pay(paymentRequest, function (rsp) {
        if (rsp.success) {
          resolve(rsp);
        } else {
          reject(new Error(rsp.error_msg || "결제 요청 실패"));
        }
      });
    });
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

  // "변경하기" 버튼 클릭 핸들러
  const handleChangeClick = async () => {
    try {
      const merchant_uid = `${
        userData.billing_key.plan
      }_${new Date().getTime()}`;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      const paymentRequest = {
        pg: config.pgCode,
        pay_method: "card",
        merchant_uid: merchant_uid,
        customer_uid: userData.billing_key.customer_uid, // 새로운 카드 정보 업데이트 예정
        name: "정기결제 카드 변경",
        amount: userData.billing_key.amount, // 0원 결제
        buyer_email: userData.email,
        buyer_name: userData.name || "테스트 유저",
        buyer_tel: userData.phone_number || "010-0000-0000",
        m_redirect_url: isMobile
          ? `${config.frontendDomain}/paymentChange`
          : undefined,
      };

      // PortOne 결제 요청
      const response = await requestPayment(paymentRequest);
      console.log("✅ 카드 변경 결제 성공:", response);

      // 결제가 성공하면 새로운 BillingKey 업데이트 요청 (BillingKeyChangeView 호출)
      await updateBillingKey(response.imp_uid, response.customer_uid);

      setShowMessageModal(true);
      setMessage("카드 정보가 성공적으로 변경되었습니다!");
    } catch (error) {
      console.error("❌ Card change error:", error);
      setShowErrorModal(true);
      setErrorMessage(mapErrorMessage(error.message));
    }
  };

  // BillingKey 변경 API 요청 (BillingKeyChangeView 호출)
  const updateBillingKey = async (imp_uid, newCustomerUid) => {
    try {
      const response = await axios.post(
        `${config.apiDomain}/api/billing-key-change/`, // BillingKeyChangeView API 엔드포인트
        { customer_uid: newCustomerUid, imp_uid: imp_uid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ BillingKey 변경 성공:", response.data);
    } catch (error) {
      console.error(
        "❌ BillingKey 변경 실패:",
        error.response?.data || error.message
      );
      throw new Error("BillingKey 변경 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[480px] relative animate-in fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">카드 변경</h2>
          <p className="text-gray-500 mt-2">새로운 카드 정보를 입력해주세요</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleChangeClick}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            변경하기
          </button>
        </div>
      </div>
      <ModalMSG
        show={showMessageModal}
        onClose={handleSuccessConfirm}
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

export default CardChangeModal;

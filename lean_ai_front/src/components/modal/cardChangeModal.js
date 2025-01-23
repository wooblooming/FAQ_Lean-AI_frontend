import React, { useState } from "react";
import { X } from "lucide-react";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";


const CardChangeModal = ({ userData, isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleSuccessConfirm = () => {
    closeMessageModal();  // 성공 메시지 모달 닫기
    onClose();  // 카드 등록 모달 닫기
    window.location.reload();  // 페이지 리로드
  };

  const handleChangeClick = async () => {
    try {
      const merchant_uid = "card_change"+ userData.billing_key.merchant_uid;

      const paymentResponse = await new Promise((resolve, reject) => {
        window.IMP.request_pay(
          {
            pg: config.pgCode, // PG사 코드
            pay_method: "card",
            merchant_uid: merchant_uid, // 고유 주문 번호
            customer_uid: userData.billing_key.customer_uid, // 기존 customer_uid 사용
            name: "정기결제 카드 변경",
            amount: 0,
            buyer_email: userData.email,
            buyer_name: userData.name || "테스트 유저",
            buyer_tel: userData.phone_number || "010-0000-0000",
          },
          function (rsp) {
            if (rsp.success) {
              resolve(rsp);
            } else {
              // 사용자가 결제를 취소한 경우 처리
              if (rsp.error_msg.includes("PAY_PROCESS_CANCELED")) {
                onClose(); // 모달 닫기
                return; // 더 이상 진행하지 않음
              }
              reject(new Error(rsp.error_msg || "결제 요청 실패"));
            }
          }
        );
      });

      setShowMessageModal(true);
      setMessage("카드 정보가 성공적으로 변경되었습니다!");
    } catch (error) {
      console.error("Card change error:", error);
      setShowErrorModal(true);
      setErrorMessage("카드 변경 실패: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[480px] relative animate-in fade-in duration-300">
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">카드 변경</h2>
          <p className="text-gray-500 mt-2">새로운 카드 정보를 입력해주세요</p>
        </div>

        {/* Action Buttons */}
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

      <ModalMSG show={showMessageModal} onClose={handleSuccessConfirm} title="Success">
        {message}
      </ModalMSG>

      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default CardChangeModal;

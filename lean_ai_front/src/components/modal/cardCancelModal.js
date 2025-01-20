import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import axios from "axios";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const CancelPaymentModal = ({ userData, token, isOpen, onClose }) => {
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
    onClose();  // 정기 결제 취소 모달 닫기
    window.location.reload();  // 페이지 리로드
  };

  const handleCancelClick = async () => {
    if (!userData.billing_key) {
      setShowErrorModal(true);
      setErrorMessage("결제 키가 존재하지 않습니다. 다시 시도해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiDomain}/api/billing-key-delete/`,
        {
          billing_key: userData.billing_key,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        setShowMessageModal(true);
        setMessage(
          response.data.message || "정기 결제가 성공적으로 해지되었습니다."
        );
      } else {
        setShowErrorModal(true);
        setErrorMessage(response.data.error || "정기 결제 해지 실패하였습니다");
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      const errorMessage =
        error.response?.data?.error ||
        "정기 결제를 해지하는 중 오류가 발생했습니다.";
      setShowErrorModal(true);
      setErrorMessage(errorMessage);
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

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            정기 결제 해지
          </h2>
          <p className="text-gray-600">정말 정기 결제를 해지하시겠습니까?</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            해지 시 유의사항:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 이번 달 결제 기간까지는 서비스 이용이 가능합니다</li>
            <li>• 다음 달부터 자동 결제가 중단됩니다</li>
            <li>• 언제든지 다시 정기 결제를 신청할 수 있습니다</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCancelClick}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            해지하기
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

export default CancelPaymentModal;

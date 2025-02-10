import React, { useState } from "react";
import { useRouter } from "next/router";
import { X, RefreshCw } from "lucide-react";
import axios from "axios";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const RestoreSubscriptionModal = ({
  subscriptionData,
  token,
  isOpen,
  onClose,
}) => {
  const subscriptionID = subscriptionData?.id;
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();

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

  // 성공 메시지 확인 버튼 동작
  const handleSuccessConfirm = () => {
    closeMessageModal();
    onClose();
    router.push("/mainPage");
  };

  // "복구하기" 버튼 클릭 핸들러
  const handleRestoreClick = async () => {
    try {
      // 구독 복구 요청
      const response = await axios.post(
        `${config.apiDomain}/api/subscription/restore/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShowMessageModal(true);
        setMessage(
          response.data.message || "구독이 성공적으로 복구되었습니다."
        );
      } else {
        throw new Error(response.data.error || "구독 복구에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error during subscription restoration:", error);
      const errorMsg =
        error.response?.data?.error ||
        "구독 복구 중 오류가 발생했습니다. 다시 시도해주세요.";
      setShowErrorModal(true);
      setErrorMessage(errorMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[480px] relative animate-in fade-in duration-300">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* 모달 제목 및 내용 */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">구독 복구</h2>
          <p className="text-gray-600">구독을 다시 시작하시겠습니까?</p>
        </div>

        {/* 안내사항 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            복구 시 안내사항:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 다음 결제일부터 정기 결제가 재개됩니다</li>
            <li>• 모든 서비스를 즉시 이용하실 수 있습니다</li>
            <li>• 언제든지 다시 해지하실 수 있습니다</li>
          </ul>
        </div>

        {/* 취소 및 복구 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleRestoreClick}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            복구하기
          </button>
        </div>
      </div>

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleSuccessConfirm}
        title="Success"
      >
        {message}
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default RestoreSubscriptionModal;

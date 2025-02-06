import React, { useState } from "react";
import { useRouter } from "next/router";
import { X, AlertCircle } from "lucide-react";
import axios from "axios";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const CancelPaymentModal = ({ subscriptionData, token, isOpen, onClose }) => {
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
    closeMessageModal(); // 성공 모달 닫기
    onClose(); // 모달 닫기
    router.push('/mainPage')
  };

  // "해지하기" 버튼 클릭 핸들러
  const handleCancelClick = async () => {
    try {
      // 구독 해지 요청
      const response = await axios.delete(
        `${config.apiDomain}/api/subscription/${subscriptionID}/`, // Subscription 해지 API
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰 추가
          },
        }
      );
  
      // 2️⃣ 응답이 정상적으로 오면 성공 모달 표시
      if (response.status === 200) {
        setShowMessageModal(true);
        setMessage(response.data.message || "구독이 성공적으로 해지되었습니다.");
      } else {
        throw new Error(response.data.error || "구독 해지에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error during subscription cancellation:", error);
      const errorMsg =
        error.response?.data?.error ||
        "구독 해지 중 오류가 발생했습니다. 다시 시도해주세요.";
      setShowErrorModal(true);
      setErrorMessage(errorMsg);
    }
  };
  

  if (!isOpen) return null; // 모달이 열리지 않았을 경우 렌더링하지 않음

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
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            구독 해지
          </h2>
          <p className="text-gray-600">정말 구독을 해지하시겠습니까?</p>
        </div>

        {/* 유의사항 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            해지 시 유의사항:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 이번 달 결제 기간까지는 서비스 이용이 가능합니다</li>
            <li>• 다음 달부터 자동 결제가 중단됩니다</li>
            <li>• 언제든지 다시 신청할 수 있습니다</li>
          </ul>
        </div>

        {/* 취소 및 해지 버튼 */}
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

export default CancelPaymentModal;

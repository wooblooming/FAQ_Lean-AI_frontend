import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { X, AlertTriangle, Trash2, Store, Info } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const DeleteStoreModal = ({ show, storeList, currentStore, onClose }) => {
  const { token } = useAuth();
  const { storeID, setStoreID, removeStoreID } = useStore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const cancelButtonRef = useRef(null);

  // 애니메이션 효과를 위한 상태
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (show) {
      //console.log("storeList:", JSON.stringify(storeList, null, 2));
      //console.log("currentStore:", JSON.stringify(currentStore, null, 2));

      setModalVisible(true);
      // 모달이 열릴 때 취소 버튼에 포커스
      setTimeout(() => {
        if (cancelButtonRef.current) {
          cancelButtonRef.current.focus();
        }
      }, 100);
    } else {
      setModalVisible(false);
    }
  }, [show]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && show) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose, show]);

  const handleDeleteStore = async () => {
    if (!currentStore || !currentStore.store_name) {
      setErrorMessage("스토어 정보가 올바르지 않습니다.");
      setShowErrorMessageModal(true);
      return;
    }

    if (confirmText !== currentStore.store_name) {
      setErrorMessage("입력한 스토어 이름이 일치하지 않습니다.");
      setShowErrorMessageModal(true);
      return;
    }

    try {
      setIsDeleting(true);

      const response = await axios.delete(
        `${API_DOMAIN}/api/stores/${currentStore.store_id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { delete_reason: deleteReason || "사용자에 의한 삭제" },
        }
      );

      if (response.status === 204) {
        setSuccessMessage("스토어가 성공적으로 삭제되었습니다!");
        setShowSuccessModal(true);

        const updatedStoreList = storeList.filter(
          (store) => store.store_id !== currentStore.store_id
        );

        /*
        console.log(
          "updatedStoreList:",
          JSON.stringify(updatedStoreList, null, 2)
        );

        console.log("🔍 [삭제 전 storeID]:", storeID);
        console.log(
          "🔍 [삭제된 currentStore.store_id]:",
          currentStore.store_id
        );
        */

        // 🔍 storeID가 삭제된 currentStore.store_id와 같은지 확인
        if (storeID == currentStore.store_id) {

          if (updatedStoreList.length > 0) {
            const newStoreID = updatedStoreList[0].store_id;
            //console.log("newStoreID :", newStoreID); 
            setStoreID(newStoreID);
            //sessionStorage.setItem("storeID", newStoreID);
          } else {
            //console.log("⚠️ 삭제 후 선택할 스토어가 없음 -> storeID 제거");
            removeStoreID();
          }
        } 

        return;
      }

      setErrorMessage("스토어 삭제 응답이 예상과 다릅니다.");
      setShowErrorMessageModal(true);
    } catch (error) {
      console.error("❌ [스토어 삭제 오류]:", error);

      const errorMsg =
        error.response?.data?.detail || "스토어 삭제에 실패하였습니다.";
      setErrorMessage(errorMsg);
      setShowErrorMessageModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    router.reload();
    onClose();
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage("");
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
      style={{ opacity: modalVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative transition-all duration-300 transform max-w-[95%] md:max-w-[42%]"
        style={{
          transform: modalVisible ? "scale(1)" : "scale(0.95)",
          opacity: modalVisible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">스토어 삭제</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 경고 메시지 */}
        <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">주의하세요!</h3>
              <p className="text-sm text-red-700 mt-1">
                스토어를 삭제하면 모든 데이터가 영구적으로 제거되며 이 작업은
                되돌릴 수 없습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 스토어 정보 */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Store className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-800">
                삭제할 스토어
              </h3>
              <p className="text-sm text-gray-700 mt-1 font-semibold">
                {currentStore.store_name}
              </p>
            </div>
          </div>
        </div>

        {/* 삭제 이유 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            삭제 이유 (선택사항)
          </label>
          <textarea
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="2"
            placeholder="삭제 이유를 입력해주세요..."
          />
        </div>

        {/* 확인 텍스트 입력 */}
        <div className="mb-6">
          <div className="flex items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              확인을 위해{" "}
              <span className="font-semibold">{currentStore.store_name}</span>{" "}
              를 입력하세요
            </label>
            <Info className="h-4 w-4 text-gray-400 ml-1" />
          </div>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={currentStore.store_name}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-row space-x-3 justify-end">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleDeleteStore}
            disabled={isDeleting || confirmText !== currentStore.store_name}
            className={`px-4 py-2 rounded-md text-white flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              confirmText === currentStore.store_name
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>삭제 중...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>삭제하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={handleErrorMessageModalClose}
      >
        <p className="whitespace-pre-line">
          {typeof errorMessage === "object"
            ? Object.entries(errorMessage).map(([key, value]) => (
                <span key={key}>
                  {key}:{" "}
                  {Array.isArray(value) ? value.join(", ") : value.toString()}
                  <br />
                </span>
              ))
            : errorMessage}
        </p>
      </ModalErrorMSG>

      {/* 성공 모달 */}
      <ModalMSG
        show={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Success"
      >
        {successMessage}
      </ModalMSG>
    </div>
  );
};

export default DeleteStoreModal;

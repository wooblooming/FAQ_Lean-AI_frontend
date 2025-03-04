import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { X, Store, MapPin, Building2, PlusCircle, Info, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const AddStoreModal = ({ show, onClose }) => {
  const { token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    store_category: "",
    store_name: "",
    store_address: "",
  });
  const [showWarning, setShowWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    store_category: false,
    store_name: false,
    store_address: false
  });
  
  // 애니메이션 효과를 위한 상태
  const [modalVisible, setModalVisible] = useState(false);
  const initialFocusRef = useRef(null);

  // 모달이 열릴 때 애니메이션 효과 적용
  useEffect(() => {
    if (show) {
      setModalVisible(true);
      // 모달이 열릴 때 카테고리 선택 필드에 포커스
      setTimeout(() => {
        if (initialFocusRef.current) {
          initialFocusRef.current.focus();
        }
      }, 100);
    } else {
      setModalVisible(false);
    }
  }, [show]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose, show]);

  // 폼 유효성 검사
  const isFormValid = () => {
    return formData.store_category !== "" && 
           formData.store_name.trim() !== "" && 
           formData.store_address.trim() !== "";
  };

  const handleAddStore = async () => {
    // 모든 필드를 터치 상태로 설정하여 유효성 검사 표시
    setTouched({
      store_category: true,
      store_name: true,
      store_address: true
    });

    if (!isFormValid()) {
      if (!formData.store_category) {
        setShowWarning(true);
      }
      
      if (!formData.store_name || !formData.store_address) {
        setErrorMessage("매장명과 주소를 모두 입력해주세요.");
        setShowErrorMessageModal(true);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await axios.post(
        `${API_DOMAIN}/api/stores/add/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 요청이 성공적으로 처리되었을 경우
      setSuccessMessage("새 스토어가 성공적으로 추가되었습니다!");
      setShowModal(true);
    } catch (error) {
      // 에러 메시지 처리
      const errorMsg =
        error.response?.data?.detail || "스토어 추가에 실패하였습니다.";
      setErrorMessage(errorMsg);
      setShowErrorMessageModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // 필드 터치 상태 업데이트
    setTouched({ ...touched, [name]: true });
    
    if (name === "store_category" && value !== "") {
      setShowWarning(false);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage("");
  };

  const handleSuccessModalClose = () => {
    setShowModal(false);
    setSuccessMessage("");
    router.reload();
    onClose();
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
          transform: modalVisible ? 'scale(1)' : 'scale(0.95)',
          opacity: modalVisible ? 1 : 0 
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <div className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-gray-800">새 스토어 추가</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* 안내 메시지 */}
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-indigo-800">스토어 정보</h3>
              <p className="text-sm text-indigo-700 mt-1">
                고객들에게 표시될 스토어 정보를 입력해주세요. <br/> 입력하신 정보는 나중에 수정할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-5">
          {/* 비즈니스 종류 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비즈니스 종류
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                ref={initialFocusRef}
                name="store_category"
                value={formData.store_category}
                onChange={handleInputChange}
                onBlur={() => handleBlur('store_category')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:border-indigo-500 transition-colors appearance-none ${
                  touched.store_category && !formData.store_category 
                    ? "border-red-300 bg-red-50 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-indigo-200"
                }`}
              >
                <option value="">비즈니스 종류를 선택해주세요</option>
                <option value="FOOD">음식점</option>
                <option value="RETAIL">판매점</option>
                <option value="UNMANNED">무인매장</option>
                <option value="OTHER">기타</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {touched.store_category && !formData.store_category && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                비즈니스 종류를 선택해주세요.
              </p>
            )}
          </div>

          {/* 매장명 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              매장명
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="store_name"
                placeholder="매장명을 입력해주세요"
                value={formData.store_name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('store_name')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:border-indigo-500 transition-colors ${
                  touched.store_name && !formData.store_name
                    ? "border-red-300 bg-red-50 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-indigo-200"
                }`}
              />
              {formData.store_name && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
              )}
            </div>
            {touched.store_name && !formData.store_name && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                매장명을 입력해주세요.
              </p>
            )}
          </div>

          {/* 주소 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="store_address"
                placeholder="매장 주소를 입력해주세요"
                value={formData.store_address}
                onChange={handleInputChange}
                onBlur={() => handleBlur('store_address')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:border-indigo-500 transition-colors ${
                  touched.store_address && !formData.store_address
                    ? "border-red-300 bg-red-50 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-indigo-200"
                }`}
              />
              {formData.store_address && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
              )}
            </div>
            {touched.store_address && !formData.store_address && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                주소를 입력해주세요.
              </p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="pt-2">
            <button
              className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center transition-colors ${
                isFormValid() 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : "bg-indigo-300 text-white cursor-not-allowed"
              }`}
              onClick={handleAddStore}
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 mr-2" />
                  스토어 추가
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
                    {key}: {Array.isArray(value) ? value.join(", ") : value.toString()}
                    <br />
                  </span>
                ))
              : errorMessage}
          </p>
        </ModalErrorMSG>

        {/* 성공 모달 */}
        <ModalMSG
          show={showModal}
          onClose={handleSuccessModalClose}
          title="Success"
        >
          {successMessage}
        </ModalMSG>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AddStoreModal;
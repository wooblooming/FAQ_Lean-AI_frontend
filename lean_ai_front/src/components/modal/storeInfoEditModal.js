import React from "react";
import { X } from "lucide-react";

const StoreInfoEditModal = ({ 
  isOpen, 
  onClose, 
  currentEditElement, 
  editText, 
  setEditText, 
  onSave, 
  onDelete 
}) => {
  if (!isOpen) return null;
  
  // 현재 편집 중인 요소에 따른 제목 설정
  const getTitle = () => {
    switch (currentEditElement) {
      case "store_name":
        return "매장 이름";
      case "store_introduction":
        return "매장 소개";
      case "store_category":
        return "비즈니스 종류";
      case "store_address":
        return "매장 위치";
      case "store_tel":
        return "매장 번호";
      case "store_information":
        return "매장 정보";
      default:
        return "내용 수정";
    }
  };

  // 현재 편집 중인 요소에 따른 플레이스홀더 설정
  const getPlaceholder = () => {
    switch (currentEditElement) {
      case "store_name":
        return "매장 이름을 입력하세요";
      case "store_introduction":
        return "매장 소개를 입력하세요";
      case "store_address":
        return "매장 위치를 입력하세요";
      case "store_tel":
        return "매장 번호를 입력하세요";
      case "store_information":
        return "매장 정보를 입력하세요";
      default:
        return "내용을 입력하세요";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fadeIn">
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-96 transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {currentEditElement === "store_category" ? (
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white mt-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          >
            <option value="">비즈니스 종류 선택</option>
            <option value="FOOD">음식점</option>
            <option value="RETAIL">판매점</option>
            <option value="UNMANNED">무인매장</option>
            <option value="OTHER">기타</option>
          </select>
        ) : (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 min-h-[120px] resize-none mt-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder={getPlaceholder()}
          />
        )}

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onDelete}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            초기화
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoEditModal;
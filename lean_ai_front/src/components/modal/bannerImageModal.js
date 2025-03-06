import React from "react";
import { X, Camera, Store } from "lucide-react";

const BannerImageModal = ({ 
  isOpen, 
  onClose, 
  onChooseImage, 
  onApplyDefaultImage 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fadeIn">
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-80 transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            배너 사진 설정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          <button
            onClick={onChooseImage}
            className="w-full py-3 px-4 flex items-center space-x-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
          >
            <Camera className="h-5 w-5" />
            <span>앨범에서 사진 선택</span>
          </button>

          <button
            onClick={onApplyDefaultImage}
            className="w-full py-3 px-4 flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
          >
            <Store className="h-5 w-5" />
            <span>기본 이미지 적용</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mt-2"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerImageModal;
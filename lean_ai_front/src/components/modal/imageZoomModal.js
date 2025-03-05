import React from "react";
import { motion } from "framer-motion"; // ✅ 애니메이션 적용을 위해 추가
import { X } from "lucide-react";

const ImageZoomModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} // 초기 상태 (작고 투명)
        animate={{ opacity: 1, scale: 1 }} // 확대되면서 나타남
        exit={{ opacity: 0, scale: 0.9 }} // 사라질 때 애니메이션
        transition={{ duration: 0.2, ease: "easeOut" }} // 부드러운 애니메이션
        className="relative max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-4"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-2xl font-bold cursor-pointer"
        >
          <X className="bg-indigo-500 rounded-full text-white p-1" />
        </button>

        {/* 이미지 컨테이너 */}
        <div className="flex justify-center items-center max-w-full max-h-[80vh]">
          <img
            src={imageUrl}
            alt="확대 이미지"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ImageZoomModal;

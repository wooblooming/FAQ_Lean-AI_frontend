import React, { useState } from "react";
import { motion } from "framer-motion";
import ImageZoomModal from "@/components/modal/imageZoomModal";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL; // 환경 변수에서 MEDIA_URL 가져오기

const FeedList = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col">
        <motion.h2
          className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-1 h-6 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></div>
          <span
            className="whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            피드
          </span>
        </motion.h2>
        <p className="p-2">저장된 피드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <motion.h2
        className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-1 h-6 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></div>
        <span
          className="whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontFamily: "NanumSquareExtraBold" }}
        >
          피드
        </span>
      </motion.h2>

      <div className="grid grid-cols-3 gap-1 p-2">
        {images.map((image, index) => {
          const fullImageUrl = `${MEDIA_URL}/media/${image.path}`; // 전체 이미지 URL 생성
          const fileName = image.name; // 이미지 파일 이름

          return (
            <div
              key={index}
              className="relative group"
              onClick={() => openModal(fullImageUrl)}
            >
              <img
                src={fullImageUrl} // 이미지 경로
                alt={fileName}
                className="w-full h-full object-cover cursor-pointer"
              />
              {/* Overlay 효과 */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <p className="text-white text-sm">{fileName}</p>
              </div>
            </div>
          );
        })}

        {/* 이미지 확대 모달달 */}
        <ImageZoomModal
          isOpen={isModalOpen}
          imageUrl={selectedImage}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default FeedList;

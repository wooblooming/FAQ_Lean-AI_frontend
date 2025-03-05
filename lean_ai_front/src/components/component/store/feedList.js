import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ImageZoomModal from "@/components/modal/imageZoomModal";
import Pagination from "@/components/ui/pagination"; 
import { paginate } from "@/utils/pagingUtils"; 

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL; 
const ITEMS_PER_PAGE = 6; 

// 카테고리별 설명 텍스트를 상수로 정의
const CATEGORY_DESCRIPTIONS = {
  FOOD: "우리 매장의 대표 메뉴와 신메뉴를 소개합니다!\n신선한 재료와 정성을 담아 준비한 요리를 확인해 보세요.",
  RETAIL: "우리 매장에서 판매하는 인기 제품과 신상품을 확인해 보세요.\n매장에서 직접 구매할 수 있는 다양한 상품과 특별 할인 정보를 제공합니다.",
  UNMANNED: "우리 매장에서 판매하는 인기 제품과 신상품을 확인해 보세요.\n매장에서 직접 구매할 수 있는 다양한 상품과 특별 할인 정보를 제공합니다.",
  DEFAULT: "현재 진행 중인 다양한 이벤트와 프로모션을 소개합니다.\n매장 방문 고객을 위한 특별한 혜택과 한정 이벤트를 놓치지 마세요."
};

const FeedList = ({ images, storeCategory }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedDescription, setFeedDescription] = useState("");

  // 카테고리에 따른 피드 설명 가져오기
  const getFeedDescription = (category) => {
    const normalizedCategory = category ? category.toUpperCase() : "";
    
    if (normalizedCategory === "FOOD") {
      return CATEGORY_DESCRIPTIONS.FOOD;
    } else if (normalizedCategory === "RETAIL" || normalizedCategory === "UNMANNED") {
      return CATEGORY_DESCRIPTIONS.RETAIL;
    } else {
      return CATEGORY_DESCRIPTIONS.DEFAULT;
    }
  };

  // 컴포넌트 마운트 또는 storeCategory 변경 시 설명 업데이트
  useEffect(() => {
    const description = getFeedDescription(storeCategory);
    setFeedDescription(description);
  }, [storeCategory]);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  // 페이지네이션 적용
  const paginatedData = paginate(images || [], currentPage, ITEMS_PER_PAGE);
  const { paginatedItems, totalPages, hasNextPage, hasPrevPage } = paginatedData;

  // 피드가 없을 때 렌더링
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col">
        <motion.h2
          className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-1.5 h-8 bg-indigo-600 rounded-r mr-3"></div>
          <span style={{ fontFamily: "NanumSquareExtraBold" }}>피드</span>
        </motion.h2>
        
        <motion.p
          className="text-gray-600 text-sm mt-2 px-3 whitespace-pre-line"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {feedDescription}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-2 text-center text-gray-500 mt-4"
        >
          저장된 피드가 없습니다.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-start mb-2">
        <motion.h2
          className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-1.5 h-8 bg-indigo-600 rounded-r mr-3"></div>
          <span
            className="whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            피드
          </span>
        </motion.h2>

        <motion.p
          className="text-gray-600 px-4 whitespace-pre-line"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: "NanumSquare", fontSize: "15px" }}
        >
          {feedDescription}
        </motion.p>
      </div>

      {/* 피드 이미지 리스트 (페이지네이션 적용) */}
      <div className="grid grid-cols-3 gap-1 p-2">
        {paginatedItems.map((image, index) => {
          const fullImageUrl = `${MEDIA_URL}/media/${image.path}`;
          const fileName = image.name;

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={index}
              className="relative aspect-square group"
              onClick={() => openModal(fullImageUrl)}
            >
              <img
                src={fullImageUrl}
                alt={fileName}
                className="w-full h-full object-cover cursor-pointer rounded-md"
              />
              {/* Overlay 효과 */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-md">
                <p className="text-white text-sm px-2 text-center">{fileName}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 페이지네이션 (6개 이상일 경우에만 표시) */}
      {images.length > ITEMS_PER_PAGE && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 이미지 확대 모달 */}
      <ImageZoomModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={closeModal}
      />
    </div>
  );
};

export default FeedList;
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-4">
      <motion.div
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* 이전 페이지 버튼 */}
        <button
          className={`p-2 flex items-center ${
            hasPrevPage
              ? "text-indigo-500 font-semibold"
              : "text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft />
        </button>
      </motion.div>

      {/* 현재 페이지 / 총 페이지 표시 */}
      <span className="text-lg font-semibold">
        {currentPage} / {totalPages}
      </span>
      <motion.div
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* 다음 페이지 버튼 */}
        <button
          className={`p-2 flex items-center ${
            hasNextPage
              ? "text-indigo-500 font-semibold"
              : "text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight />
        </button>
      </motion.div>
    </div>
  );
};

export default Pagination;

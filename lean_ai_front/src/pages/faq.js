import React, { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  CreditCard,
  Settings,
  HelpCircle,
  UserRound,
} from "lucide-react";
import faqs from "/public/text/faq.json"; // FAQ 데이터
import { paginate } from "@/utils/pagingUtils";
import Pagination from "@/components/ui/pagination";

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("모든 질문"); // 선택된 카테고리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [expandedId, setExpandedId] = useState(null); // 펼쳐진 질문 ID
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 5; // 페이지당 항목 수

  // 카테고리 버튼 데이터
  const categories = [
    { name: "모든 질문", icon: HelpCircle },
    { name: "계정", icon: UserRound },
    { name: "구독", icon: CreditCard },
    { name: "서비스", icon: Settings },
  ];

  // 카테고리 및 검색어를 기준으로 FAQ를 필터링
  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "모든 질문" || faq.category === activeCategory) &&
      (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 필터링된 데이터를 paginate 함수로 페이징 처리
  const { paginatedItems, totalPages, hasNextPage, hasPrevPage } = paginate(
    filteredFaqs,
    currentPage,
    itemsPerPage
  );

  return (
    <div className="min-h-screen py-12 px-4 font-sans bg-violet-50">
      <div
        className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg bg-white"
        style={{ backgroundColor: "#fff", borderRadius: "50px 0 50px 0" }}
      >
        <div className="flex items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft
              className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
              onClick={() => router.back()}
            />
          </motion.div>
          <h1
            className="text-3xl font-bold text-center text-indigo-600"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            자주 묻는 질문
          </h1>
        </div>

        {/* 검색 바 */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="질문 검색하기"
            className="w-full py-3 pl-12 pr-4 text-gray-900 border-2 border-indigo-500 rounded-full transition-all duration-300"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 검색할 때 1페이지로 리셋
            }}
          />
          <Search className="absolute left-4 top-3.5 h-6 w-6 text-indigo-400" />
        </div>

        {/* 카테고리 버튼 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.name}
              className={`flex items-center px-4 py-2 rounded-full ${
                activeCategory === category.name
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-600"
              }`}
              style={{
                fontFamily:
                  activeCategory === category.name
                    ? "NanumSquareExtraBold"
                    : "NanumSquareBold",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(category.name);
                setCurrentPage(1); // 카테고리 변경 시 1페이지로 리셋
              }}
            >
              <category.icon className="mr-2 md:h-5 md:w-5" />
              <p className="whitespace-nowrap">{category.name}</p>
            </motion.button>
          ))}
        </div>

        {/* FAQ 리스트 */}
        <div className="space-y-4">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((faq) => (
              <div
                key={faq.id}
                className="bg-indigo-100 rounded-lg overflow-hidden"
              >
                {/* 질문 부분 */}
                <button
                  className="w-full text-left px-6 py-3 flex justify-between items-center"
                  onClick={() =>
                    setExpandedId(expandedId === faq.id ? null : faq.id)
                  }
                >
                  <div
                    className={`font-semibold text-lg ${
                      expandedId === faq.id ? "text-indigo-500" : ""
                    }`}
                    style={{
                      fontFamily:
                        expandedId === faq.id
                          ? "NanumSquareExtraBold"
                          : "NanumSquareBold",
                    }}
                  >
                    {faq.question}
                  </div>
                  {expandedId === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-indigo-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-indigo-500" />
                  )}
                </button>

                {/* 답변 부분 */}
                {expandedId === faq.id && (
                  <div className="px-6 py-2 bg-white">
                    {faq.answer.split(". ").map((sentence, index, array) => (
                      <p
                        key={index}
                        className="text-gray-600 text-lg"
                        style={{ fontFamily: "NanumSquare" }}
                      >
                        {sentence}
                        {index < array.length - 1 ? "." : ""}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">
              검색 결과가 없습니다.
            </p>
          )}
        </div>

        {/* 페이지네이션 버튼 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default FAQPage;

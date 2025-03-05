import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TriangleAlert,
  X,
  Star,
  Info,
  RotateCcw,
  Search,
} from "lucide-react";
import AllergyModal from "@/components/modal/allergyModal";
import { paginate } from "@/utils/pagingUtils";
import Pagination from "@/components/ui/pagination"; // 페이지네이션 UI 추가


const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

// MenuList 컴포넌트: 그리드 형태의 카드로 메뉴 표시
const MenuList = ({ menu, storeCategory, menuTitle }) => {
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showItemDetail, setShowItemDetail] = useState(null);
  const ITEMS_PER_PAGE = 4; // 한 페이지당 표시할 메뉴 개수
  const [currentPage, setCurrentPage] = useState(1);

  // 메뉴를 카테고리별로 그룹화
  const groupedMenu = groupMenuByCategory(menu);

  // 카테고리 목록
  const categories = groupedMenu ? Object.keys(groupedMenu) : [];

  // 필터 토글 함수
  const toggleFilter = (category) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
    // 필터 변경 시 첫 페이지로 이동
    setCurrentPage(1);
  };

  // paginate 유틸 함수 사용하여 현재 페이지 데이터 가져오기
  const { paginatedItems, totalPages, hasNextPage, hasPrevPage } = paginate(
    menu,
    currentPage,
    ITEMS_PER_PAGE
  );

  // 알레르기 모달 토글
  const toggleAllergyModal = () => {
    setShowAllergyModal((prev) => !prev);
  };

  // 상세 정보 모달 토글
  const toggleItemDetail = (item) => {
    setShowItemDetail((prev) => (prev === item ? null : item));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    // 유효한 페이지 번호인지 확인
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 페이지 변경 시 스크롤을 상단으로 이동 (선택적)
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더: 타이틀과 알레르기 정보 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-r mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center min-w-0">
            {menuTitle} 정보
          </h2>
        </motion.div>

        {storeCategory === "FOOD" && (
          <button
            onClick={toggleAllergyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200 shadow-sm hover:bg-amber-100 transition-all"
          >
            <TriangleAlert className="w-4 h-4" />
            <span className="text-sm font-medium">알레르기 정보</span>
          </button>
        )}
      </div>

      {/* 필터 영역 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        {/* 카테고리 필터 칩 */}
        {categories.length > 0 && (
          <div className="flex justify-between items-center flex-wrap gap-2">
            {/* 카테고리 칩 영역 (왼쪽 정렬) */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleFilter(category)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    activeFilters.includes(category)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                  {activeFilters.includes(category) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* 초기화 버튼 (오른쪽 끝 정렬) */}
            {activeFilters.length > 0 && (
              <button
                onClick={() => {
                  setActiveFilters([]);
                  setCurrentPage(1); // 필터 초기화 시 첫 페이지로 이동
                }}
                className="px-3 py-1 rounded-full text-sm font-semibold text-gray-500 bg-white 
                    hover:bg-gray-500 hover:text-white transition-all flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" /> 초기화
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* 메뉴 그리드 */}
      <div className="flex-1 overflow-y-auto">
        {paginatedItems.length > 0 ? (
          <>
            <div className="text-sm text-gray-500 mb-3">
              {paginatedItems.length}개의 {menuTitle}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {paginatedItems.map((item, index) => (
                <MenuCard
                  key={`${item.name}-${index}`}
                  menu={item}
                  onClick={() => toggleItemDetail(item)}
                />
              ))}
            </div>

            {/* 페이지네이션 컴포넌트 */}
            {totalPages > 1 && (
              <div className="mt-6 mb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasPrevPage={hasPrevPage}
                  hasNextPage={hasNextPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg text-center p-6">
            <Search className="h-10 w-10 mb-2 text-gray-300" />
            <p className="text-gray-500 font-medium">
              등록된 {menuTitle}가 없습니다
            </p>
          </div>
        )}
      </div>

      {/* 메뉴 상세 정보 모달 */}
      {showItemDetail && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => toggleItemDetail(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} // 초기 상태 (작고 투명)
            animate={{ opacity: 1, scale: 1 }} // 확대되면서 나타남
            exit={{ opacity: 0, scale: 0.9 }} // 사라질 때 애니메이션
            transition={{ duration: 0.2, ease: "easeOut" }} // 부드러운 애니메이션
            className="bg-white rounded-xl shadow-xl p-5 m-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={
                    showItemDetail.image
                      ? `${MEDIA_URL}${showItemDetail.image}`
                      : "/images/menu_default_image.png"
                  }
                  alt={showItemDetail.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {showItemDetail.best && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  인기
                </div>
              )}

              <button
                onClick={() => toggleItemDetail(null)}
                className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">
                  {showItemDetail.name}
                </h3>
                <div className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-sm">
                  {showItemDetail.category}
                </div>
              </div>

              <div className="mt-1 flex items-baseline">
                {showItemDetail.discounted_price &&
                showItemDetail.discounted_price < showItemDetail.price ? (
                  <>
                    <p className="text-xl font-bold text-red-600">
                      {Math.floor(
                        showItemDetail.discounted_price
                      ).toLocaleString()}{" "}
                      원
                    </p>
                    <p className="ml-2 text-sm text-gray-400 line-through">
                      {Math.floor(showItemDetail.price).toLocaleString()} 원
                    </p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-indigo-600">
                    {Math.floor(showItemDetail.price).toLocaleString()} 원
                  </p>
                )}
              </div>

              {showItemDetail.description && (
                <p className="mt-4 text-gray-600">
                  {showItemDetail.description}
                </p>
              )}

              {/* 알레르기 정보나 추가 정보가 있다면 표시 */}
              {showItemDetail.allergens && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center text-amber-800 font-medium mb-1">
                    <TriangleAlert className="h-4 w-4 mr-1" />
                    알레르기 정보
                  </div>
                  <p className="text-amber-700 text-sm">
                    {showItemDetail.allergens}
                  </p>
                </div>
              )}

              {/* 영양 정보가 있다면 표시 */}
              {showItemDetail.nutrition && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center text-indigo-800 font-medium mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    영양 정보
                  </div>
                  <p className="text-indigo-700 text-sm">
                    {showItemDetail.nutrition}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 알레르기 모달 */}
      <AllergyModal
        show={showAllergyModal}
        onClose={toggleAllergyModal}
        menuDetails={menu}
      />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// MenuCard 컴포넌트: 그리드 형태 메뉴 카드
const MenuCard = ({ menu, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
    onClick={onClick}
  >
    {/* 메뉴 이미지 */}
    <div className="relative h-28 bg-gray-100">
      <img
        src={
          menu.image
            ? `${MEDIA_URL}${menu.image}`
            : "/images/menu_default_image.png"
        }
        alt={menu.name}
        className="w-full h-full object-cover"
      />

      {/* 인기 메뉴 표시 */}
      {menu.best && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold flex items-center">
          <Star className="h-3 w-3 mr-0.5" />
          인기
        </div>
      )}

      {/* 카테고리 표시 */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs">
        {menu.category}
      </div>
    </div>

    {/* 메뉴 정보 */}
    <div className="p-3 flex flex-col flex-1">
      <h4 className="font-bold text-gray-800 truncate" title={menu.name}>
        {menu.name}
      </h4>

      <div className="mt-auto pt-2">
        <div className="flex items-baseline">
          {menu.discounted_price && menu.discounted_price < menu.price ? (
            <>
              <p className="font-bold text-red-600 text-sm">
                {Math.floor(menu.discounted_price).toLocaleString()} 원
              </p>
              <p className="ml-1 text-xs text-gray-400 line-through">
                {Math.floor(menu.price).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="font-bold text-indigo-600 text-sm">
              {Math.floor(menu.price).toLocaleString()} 원
            </p>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// groupMenuByCategory 함수: 메뉴를 카테고리별로 그룹화
const groupMenuByCategory = (menuList) => {
  if (!menuList || !Array.isArray(menuList)) {
    return null;
  }
  return menuList.reduce((acc, menu) => {
    if (!acc[menu.category]) acc[menu.category] = [];
    acc[menu.category].push(menu);
    return acc;
  }, {});
};

export default MenuList;
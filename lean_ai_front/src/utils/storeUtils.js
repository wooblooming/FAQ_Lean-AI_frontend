import { CookingPot, Package, ShoppingBag } from "lucide-react";

/**
 * 상점 카테고리에 따라 아이콘을 반환하는 함수
 * @param {string} category - 상점 카테고리 (FOOD, RETAIL, UNMANNED, OTHER)
 * @returns {React.Component} - 해당 카테고리의 아이콘 컴포넌트
 */
export const getCategoryIcon = (category) => {
  switch (category) {
    case "FOOD":
      return CookingPot; // 음식점 아이콘
    case "RETAIL":
    case "UNMANNED":
      return ShoppingBag; // 판매점 & 무인매장 아이콘
    default:
      return Package; // 기본 아이콘 (기타)
  }
};

/**
 * 상점 카테고리에 따라 메뉴(상품) 제목을 반환하는 함수
 * @param {string} category - 상점 카테고리 (FOOD, RETAIL, UNMANNED, OTHER)
 * @returns {string} - 해당 카테고리에 맞는 메뉴 탭 이름
 */
export const getMenuTitle = (category) => {
  switch (category) {
    case "FOOD":
      return "메뉴";
    case "RETAIL":
    case "UNMANNED":
      return "상품";
    default:
      return "기타";
  }
};

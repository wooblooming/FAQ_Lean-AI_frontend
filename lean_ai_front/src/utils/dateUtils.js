import dayjs from "dayjs";

/**
 * ✅ 날짜 문자열을 YYYY-MM-DD 형식으로 변환
 */
export const formatDate = (dateString) => {
  if (!dateString) return "정보 없음";
  return dayjs(dateString).format("YYYY-MM-DD");
};

/**
 * ✅ 날짜에서 하루 빼서 반환 (구독 해지일 -1일)
 */
export const getLastAvailableDate = (dateString) => {
  if (!dateString) return "정보 없음";
  return dayjs(dateString).subtract(1, "day").format("YYYY-MM-DD");
};

/**
 * ✅ 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

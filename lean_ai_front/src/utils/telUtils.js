/**
 * 📌 전화번호 형식 변환 (하이픈 자동 추가)
 * - 01012345678 → 010-1234-5678
 * - 021234567   → 02-1234-567
 * - 02345678    → 02-345-678
 */
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
  
    // 숫자만 남기기
    const cleaned = phoneNumber.replace(/\D/g, "");
  
    // 010-xxxx-xxxx 또는 01x-xxx-xxxx
    if (/^01[016789]\d{7,8}$/.test(cleaned)) {
      return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    }
  
    // 02-xxx-xxxx 또는 02-xxxx-xxxx (서울 지역번호)
    if (/^02\d{7,8}$/.test(cleaned)) {
      return cleaned.replace(/(02)(\d{3,4})(\d{4})/, "$1-$2-$3");
    }
  
    // 0xx-xxx-xxxx (다른 지역번호)
    if (/^0[3-9]\d{8}$/.test(cleaned)) {
      return cleaned.replace(/(0[3-9]\d)(\d{3})(\d{4})/, "$1-$2-$3");
    }
  
    // 0xx-xx-xxxx (다른 지역번호, 9자리)
    if (/^0[3-9]\d{7}$/.test(cleaned)) {
      return cleaned.replace(/(0[3-9]\d)(\d{2})(\d{4})/, "$1-$2-$3");
    }
  
    // 변환 불가한 경우 원본 반환
    return phoneNumber;
  };
  
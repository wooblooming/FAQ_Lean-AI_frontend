import axios from 'axios';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export const fetchAllStoreData = async (token, setStoreList, setErrorMessage, setShowErrorMessageModal) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // ✅ 모든 매장 리스트 조회
    const response = await axios.get(`${API_DOMAIN}/api/stores/`, { headers });

    if (response.status === 200 && response.data.stores.length > 0) {
      //console.log("stores all : ",response.data.stores);
      setStoreList(response.data.stores);
    } else {
      throw new Error("등록된 매장이 없습니다.");
    }
  } catch (error) {
    console.error("fetchStoreData - error:", error);
    setErrorMessage("매장 정보를 가져오는 중 오류가 발생했습니다.");
    setShowErrorMessageModal(true);
  }
};


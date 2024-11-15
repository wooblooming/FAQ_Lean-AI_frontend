// fetchStoreData.js
import config from '../../config';

export const fetchStoreData = async (slug, token, setStoreData, setMenuPrice, setStoreCategory, setAgentId, setIsLoading) => {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const response = await fetch(`${config.apiDomain}/api/storesinfo/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: decodedSlug,
        type: 'owner',
      }),
    });

    const data = await response.json();
    //console.log("store data : ", data);

    if (data && data.store) {
      try {
        const menuPrice = JSON.parse(data.store.menu_price);
        setMenuPrice(menuPrice);
        //console.log("Parsed menuPrice:", menuPrice);
        setStoreCategory(data.store.store_category)
        setAgentId(data.store.agent_id);
      } catch (parseError) {
        //console.error("Error parsing menu_price:", parseError);
      }
    } else {
      console.error("No menu_price found in response data.");
    }
    setStoreData(data); // 가져온 데이터를 상태로 설정
  } catch (error) {
    console.error("Error fetching store data:", error);
  } finally {
    setIsLoading(false); // 로딩 완료 상태로 변경
  }
};

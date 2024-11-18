// fetchStoreData.js
import config from '../../config';

export const fetchStoreData = async (slug, token, setStoreData, setMenuPrice, setStoreCategory, setAgentId, setIsLoading, isOwner) => {
  const type = isOwner ? 'owner' : 'customer';

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
        type: type,
      }),
    });

    const data = await response.json();
    const result = data.store;

    if (result) {
      try {
        const menuPrice = JSON.parse(result.menu_price);
        //console.log("Parsed menuPrice:", menuPrice);
        setMenuPrice(menuPrice);
        setStoreCategory(result.store_category);
        //console.log("Fetched store category:", result.store_category); // 디버깅 로그
        setAgentId(result.agent_id);
      } catch (parseError) {
        console.error("Error parsing menu_price:", parseError);
      }
    } else {
      console.error("No result found in response data.");
    }

    setStoreData(data);
  } catch (error) {
    console.error("Error fetching store data:", error);
  } finally {
    setIsLoading(false); // 로딩 완료 상태로 변경
  }
};

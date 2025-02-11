import axios from 'axios';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export const fetchSubscription = async (token, ID, setSubscriptionData, setCardInfo, setErrorMessage) => {
    try {
      const response = await axios.get(`${API_DOMAIN}/api/subscription/${ID}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("Subscription Info:", response.data);
      setSubscriptionData(response.data.subscription);
      setCardInfo(response.data.card_info);
    } catch (error) {
      console.error("Failed to fetch card info:", error);
      setErrorMessage(`카드 정보를 가져오는데 실패했습니다.`);
    }
  };
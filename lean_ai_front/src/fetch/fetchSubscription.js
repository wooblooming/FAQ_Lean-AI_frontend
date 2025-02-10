import axios from 'axios';
import config from '../../config';

export const fetchSubscription = async (token, ID, setSubscriptionData, setCardInfo, setErrorMessage) => {
    try {
      const response = await axios.get(`${config.apiDomain}/api/subscription/${ID}/`, {
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
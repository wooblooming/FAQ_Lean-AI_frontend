import axios from 'axios';
import config from '../../config';

export const fetchCardInfo = async (token, setCardInfo, setErrorMessage) => {
    try {
      const response = await axios.get(`${config.apiDomain}/api/card-info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("Card Info:", response.data);
      setCardInfo(response.data.response);
    } catch (error) {
      console.error("Failed to fetch card info:", error);
      setErrorMessage(`카드 정보를 가져오는데 실패했습니다.`);
    }
  };
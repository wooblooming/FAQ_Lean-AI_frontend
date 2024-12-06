import axios from 'axios';
import config from '../../config';

export const fetchStoreData = async ({ slug, storeID }, token, setStoreData, setErrorMessage, setShowErrorMessageModal, isOwner) => {
  const type = isOwner ? 'owner' : 'customer';

  try {
    let response;

    // slug 또는 storeID에 따라 URL 및 메서드 분기
    if (slug) {
      response = await axios.post(
        `${config.apiDomain}/api/stores/detail_by_slug/`,
        { slug: decodeURIComponent(slug), type },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
    } else if (storeID) {
      response = await axios.get(
        `${config.apiDomain}/api/stores/${storeID}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
    }

    // 성공 응답 처리
    if (response?.status === 200 && response.data) {
      console.log('fetchStoreData - store data:', response.data);
      setStoreData(response.data);
    } else {
      throw new Error('매장 정보를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('fetchStoreData - error:', error);

    if (error.response) {
      const serverMessage =
        error.response.data?.error || '서버에서 에러가 발생했습니다.';
      setErrorMessage(serverMessage);
    } else if (error.message.includes('Network Error')) {
      setErrorMessage(
        '서버와 연결할 수 없습니다. 인터넷 연결을 확인하거나 나중에 다시 시도하세요.'
      );
    } else {
      setErrorMessage(
        '매장 정보를 가져오는 중 문제가 발생했습니다. 관리자에게 문의하세요.'
      );
    }

    setShowErrorMessageModal(true);
  }
};

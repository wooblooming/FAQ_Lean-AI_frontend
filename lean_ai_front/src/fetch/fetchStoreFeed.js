import axios from 'axios';
import config from '../../config';

export const fetchFeedImage = async ({ slug, storeID }, token, setImages) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    let response;

    if (slug) {
      // slug 기반 요청
      response = await axios.get(
        `${config.apiDomain}/api/feeds/list_images_by_slug/`,
        {
          headers,
          params : {slug: decodeURIComponent(slug)},
        }
      );
    } else if (storeID) {
      // storeID 기반 요청
      response = await axios.get(
        `${config.apiDomain}/api/feeds/list_images/`,
        {
          headers,
          params: { store_id: storeID }, // 쿼리 파라미터로 storeID 전달
        }
      );
    } else {
      throw new Error('slug 또는 storeID가 필요합니다.');
    }

    // 응답 데이터 처리
    const images = response.data?.images || [];
    setImages(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    setImages([]);
  }
};

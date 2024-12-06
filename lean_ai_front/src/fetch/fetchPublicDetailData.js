import axios from 'axios';
import config from '../../config';

export const fetchPublicDetailData = async (slug, token, setPublicData, setErrorMessage, setShowErrorMessageModal, isOwner) => {
  const type = isOwner ? 'owner' : 'customer';
  try {
    const decodedSlug = decodeURIComponent(slug); // 인코딩된 슬러그 디코딩

    const response = await axios.post(`${config.apiDomain}/public/publics/detail_by_slug/`,
      {
        slug: decodedSlug,
        type: type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // console.log("fetch public detail - response data : ", response.data);
    if (response.data) {
      setPublicData(response.data); // 데이터 설정
    } else {
      setErrorMessage('유효한 데이터를 가져오지 못했습니다.');
      setShowErrorMessageModal(true);
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('로딩 중에 에러가 발생 했습니다.');
    setShowErrorMessageModal(true);
  }
};

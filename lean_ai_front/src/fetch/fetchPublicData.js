import axios from 'axios';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export const fetchPublicData = async (slug, token, setPublicData, setErrorMessage, setShowErrorMessageModal, isOwner) => {
  const type = isOwner ? 'owner' : 'customer';
  try {
    const decodedSlug = decodeURIComponent(slug); // 인코딩된 슬러그 디코딩

    const response = await axios.get(`${API_DOMAIN}/public/publics/`, {
      params: {
        slug: decodedSlug,
        type: type,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

     console.log("fetch public - response data : ", response.data);
    if (response.data && response.data.public) {
      setPublicData(response.data.public); // 데이터 설정
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

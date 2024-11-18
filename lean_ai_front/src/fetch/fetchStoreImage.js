import axios from 'axios';
import config from '../../config';

export const fetchImages = async (slug, setImgaes) => {
  const decodedSlug = decodeURIComponent(slug);

  try {
    const response = await axios.post(`${config.apiDomain}/api/images/`, { slug: decodedSlug });

    //console.log('Response data:', response.data);

    // 백엔드 응답에서 이미지 리스트를 setImgaes에 저장
    if (response.data.success && response.data.data?.images) {
      setImgaes(response.data.data.images); // 이미지 리스트 저장
      //console.log('Fetched images:', response.data.data.images);
    } else {
      //console.log('No images found.');
      setImgaes([]); // 이미지가 없을 경우 빈 배열 저장
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    setImgaes([]); // 에러 발생 시 빈 배열 저장
  }
};

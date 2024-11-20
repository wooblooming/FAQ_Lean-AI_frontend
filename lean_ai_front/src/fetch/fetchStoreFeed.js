import axios from 'axios';
import config from '../../config';

export const fetchFeedImage = async ({ slug, storeID }, token, setImages) => {
    try {
        const payload = slug
            ? { slug: decodeURIComponent(slug) }
            : { store_id: storeID };

        // 동적으로 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // token이 있을 경우에만 Authorization 헤더 추가
        };

        const response = await axios.post(`${config.apiDomain}/api/feed/`, payload, {
            headers,
        });

        //console.log("response data : ", response.data);

        if (response.data.success && response.data.data?.images) {
            const formattedImages = response.data.data.images.map((img) => ({
                id: img.id,
                name: img.name,
                path: img.path,
                ext: img.ext
            }));
            setImages(formattedImages);
        } else {
            setImages([]);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        setImages([]);
    }
};

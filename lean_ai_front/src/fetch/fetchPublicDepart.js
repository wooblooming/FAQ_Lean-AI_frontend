// fetchPublicDepartment.js
import axios from 'axios';
import config from '../../config';

export const fetchPublicDepartment = async ({slug, storeID}, token, setDepartment) => {
    try {
        const payload = slug
            ? { slug: decodeURIComponent(slug) }
            : { publicID: storeID };

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // token이 있을 경우에만 Authorization 헤더 추가
        };

        const response = await axios.post(`${config.apiDomain}/public/department-list/`,  payload, {
            headers,
        });

        //console.log("Fetched department data:", response.data);
        setDepartment(response.data); // 배열로 업데이트
    } catch (error) {
        console.error('부서 목록을 불러오는 중 오류 발생:', error);

    }
};
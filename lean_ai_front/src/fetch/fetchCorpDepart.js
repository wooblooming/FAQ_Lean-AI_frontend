// fetchPublicDepartment.js
import axios from 'axios';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export const fetchCorpDepartment = async ({ slug, storeID }, token, setDepartments) => {
    try {
        const data = slug
            ? { slug: decodeURIComponent(slug) }
            : { publicID: storeID };

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // token이 있을 경우에만 Authorization 헤더 추가
        };

        const response = await axios.post(`${API_DOMAIN}/corp/departments/list_departments/`, data, {
            headers,
        });

        setDepartments(response.data.departments);
    } catch (error) {
        console.error('부서 목록을 불러오는 중 오류 발생:', error);
    }
};

import axios from 'axios';
import config from '../../config';

export const fetchStoreMenuItem = async ({ slug, storeID }, token, setMenuItems, setErrorMessage, setShowErrorMessageModal) => {
    try {
        // slug 또는 store_id를 기준으로 params 설정
        const params = slug
            ? { slug: decodeURIComponent(slug), action: 'view'}
            : { store_id: storeID, action: 'view' };

        // 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // token이 있을 경우 Authorization 추가
        };

        // axios GET 요청
        const response = await axios.get(`${config.apiDomain}/api/menus/`, { headers, params });

        // 응답 데이터 처리
        if (response.status === 200 && Array.isArray(response.data)) {
            setMenuItems(response.data); // 배열 데이터를 setMenuItems로 설정
            //console.log('fetchStoreMenuItem - menu items:', response.data);
        } else {
            setErrorMessage("해당 매장 정보를 찾을 수 없습니다. 관리자에게 문의하세요.");
            setShowErrorMessageModal(true);
        }
    } catch (error) {
        // 에러 처리
        console.error("fetchStoreMenuItem - error:", error);

        if (error.response) {
            // 서버에서 반환된 에러 처리
            const serverMessage = error.response.data?.error || "서버에서 에러가 발생했습니다.";
            setErrorMessage(serverMessage);
        } else if (error.message.includes("Network Error")) {
            setErrorMessage("서버와 연결할 수 없습니다. 인터넷 연결을 확인하거나 나중에 다시 시도하세요.");
        } else {
            setErrorMessage(`정보를 가져오는 중 문제가 발생했습니다. 관리자에게 문의하세요.`);
        }

        setShowErrorMessageModal(true);
    }
};

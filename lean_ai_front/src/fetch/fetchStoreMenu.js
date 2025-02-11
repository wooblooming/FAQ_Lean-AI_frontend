import axios from 'axios';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export const fetchStoreMenu = async ({ slug, storeID }, token, setMenu, setErrorMessage, setShowErrorMessageModal) => {
    try {

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        let response;

        // slug 또는 storeID에 따라 URL 및 메서드 분기
        if (slug) {
            // slug 기반 요청
            response = await axios.get(
                `${API_DOMAIN}/api/menus/list_menus_by_slug/`,
                {
                    headers,
                    params : {slug: decodeURIComponent(slug)},
                }
            );
        } else if (storeID) {
            // storeID 기반 요청
            response = await axios.get(
                `${API_DOMAIN}/api/menus/${storeID}/`,
                {
                    headers,
                }
            );
        } else {
            throw new Error('slug 또는 storeID가 필요합니다.');
        }

        if (response.status === 200 && response.data) {
            setMenu(response.data); // 데이터 설정
            //console.log('fetchStoreMenu - menu data:', response.data);
        } else {
            setErrorMessage("해당 매장 정보를 찾을 수 없습니다. 관리자에게 문의하세요.");
            setShowErrorMessageModal(true);
        }
    } catch (error) {
        // 에러 처리
        console.error("fetchStoreMenu - error:", error);

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

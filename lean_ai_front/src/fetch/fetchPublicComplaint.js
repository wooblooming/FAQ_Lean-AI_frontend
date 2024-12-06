// fetchPublicComplaint.js
import axios from 'axios';
import config from '../../config';

export const fetchPublicComplaint = async (storeID, token, setComplaints , setErrorMessage, setShowErrorModal) => {
    try {
        const response = await axios.get(
            `${config.apiDomain}/public/complaints/`,
            {
                params: { publicID: storeID }, // GET 요청에 적합한 방식
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        setComplaints(response.data);
        //console.log("response.data : ", response.data);
    } catch (error) {
        console.error("민원 데이터를 가져오는 중 오류가 발생했습니다:", error);
        setErrorMessage("민원 데이터를 불러오는 중 오류가 발생했습니다.");
        setShowErrorModal(true);
    }
};
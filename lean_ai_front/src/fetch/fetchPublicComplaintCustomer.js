// fetchPublicComplaintCustomer.js
import axios from 'axios';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export const fetchPublicComplaintCustomer = async (complaintNum, phone, setComplaintDetails, setErrorMessage, setShowErrorModal) => {
    try {
        const response = await axios.post(`${API_DOMAIN}/public/complaints/customer_view/`, {
            complaint_number: complaintNum,
            phone,
        });

        if (response.status === 200 && response.data.success) {
            setComplaintDetails(response.data.complaint); // 성공적으로 민원 데이터 가져옴
            //console.log(response.data.complaint);

        } else {
            setErrorMessage(response.data.message || '민원 조회에 실패했습니다.');
            setShowErrorModal(true);
        }
    } catch (error) {
        setErrorMessage('민원 조회 중 네트워크 오류가 발생했습니다.');
        setShowErrorModal(true);
    }
};
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '../contexts/authContext';
import axios from 'axios';
import config from '../../config';

export default function TransferDepartmentModal({ show, onClose, depart, onTransfer, complaintId }) {
    const { token } = useAuth();
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!show) return null;

    const departmentList = depart && Array.isArray(depart.departments) ? depart.departments : [];

    const handleTransfer = async () => {
        if (!selectedDepartment || !reason) {
            setErrorMessage("부서와 이관 사유를 모두 입력해야 합니다.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post(
                `${config.apiDomain}/public/complaint-transfer/`,
                {
                    complaint_id: complaintId,
                    department: selectedDepartment,
                    reason: reason,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                }
            );
    
            console.log('Transfer response:', response.data);
            onTransfer(complaintId, selectedDepartment, reason); // 성공적으로 전송 후 콜백 호출
            handleClose(); // 모달 닫기
        } catch (error) {
            console.error('Error transferring complaint:', error);
    
            // 백엔드의 에러 메시지 설정
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error || '민원 이관 중 오류가 발생했습니다.');
            } else {
                setErrorMessage('민원 이관 중 알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };
    

    const handleClose = () => {
        setReason(''); // reason 초기화
        setErrorMessage('');
        setSelectedDepartment(''); // selectedDepartment 초기화
        onClose(); // 부모 컴포넌트에서 전달된 닫기 핸들러 호출
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md">
                <div className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded-t-lg">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "NanumSquareExtraBold" }}>민원 이관</h2>
                    <button variant="ghost" onClick={handleClose}>
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4" style={{ fontFamily: "NanumSquareBold" }}>
                    <div className="space-y-2">
                        <Label htmlFor="department">이관할 부서</Label>
                        <select
                            id="department"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">부서 선택</option>
                            {departmentList.map((dept, index) => (
                                <option key={index} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="reason">이관 사유</Label>
                        <input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="이관 사유를 입력하세요"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </div>

                <div className="bg-gray-100 p-4 flex justify-end space-x-2 rounded-b-lg">
                    <Button variant="outline" onClick={handleClose}>취소</Button>
                    <Button
                        onClick={handleTransfer}
                        disabled={loading || !selectedDepartment || !reason}
                    >
                        {loading ? '이관 중...' : '이관하기'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

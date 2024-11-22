import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import ComplaintDetailModal from '../components/complaintDetailModal';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

const ComplaintsDashboard = () => {
    const router = useRouter();
    const { token } = useAuth();
    const { storeID } = useStore();
    const [complaints, setComplaints] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [selectedTab, setSelectedTab] = useState('전체보기'); // 초기 탭 설정

    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    useEffect(() => {
        if (storeID && token) {
            postComplaints();
        }
    }, [storeID, token]);

    const postComplaints = async () => {
        try {
            const response = await axios.post(
                `${config.apiDomain}/public/complaints/`,
                { publicID: storeID },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setComplaints(response.data);
        } catch (error) {
            console.error("민원 데이터를 가져오는 중 오류가 발생했습니다:", error);
            setErrorMessage("민원 데이터를 불러오는 중 오류가 발생했습니다.");
            setShowErrorModal(true);
        }
    };


    return (
        <div className="min-h-screen p-6 font-sans bg-violet-50">
            <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg bg-white">
                <div className="flex items-center">
                    <ChevronLeft
                        className="h-6 w-6 md:h-8 md:w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-xl md:text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: "NanumSquareExtraBold" }}>민원 조회 및 관리</h1>
                </div>

                <div className="flex flex-col space-y-2 md:flex-row">
                    {/* 사이드바 탭 */}
                    <div className="w-full md:w-1/5 md:pr-6">
                        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 space-y-0 md:space-y-2 text-base md:text-lg whitespace-nowrap">
                            {['전체보기', '접수', '처리 중', '완료'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-2 py-2 w-full text-center md:text-left rounded-lg text-indigo-700 ${selectedTab === tab
                                        ? 'bg-indigo-100 text-lg md:text-xl'
                                        : 'hover:bg-gray-100'
                                        }`}
                                    style={{ fontFamily: selectedTab === tab ? "NanumSquareExtraBold" : "NanumSquareBold" }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="w-full md:w-3/4 ml-0 md:ml-8 grid gap-4 grid-cols-1 md:grid-cols-2 " style={{ fontFamily: "NanumSquareBold" }}>
                        {complaints.length === 0 ? (
                            <p className="text-center w-full col-span-2 text-gray-500">아직 등록된 민원이 없습니다</p>
                        ) : (
                            complaints
                                .filter((complaint) => selectedTab === '전체보기' || complaint.status === selectedTab)
                                .map((complaint) => (
                                    <Card key={`card-${complaint.complaint_id}`}>
                                        <CardHeader>
                                            <CardTitle className="text-xl" style={{ fontFamily: "NanumSquareExtraBold" }}> {complaint.title}</CardTitle>
                                            <p className="text-sm text-gray-600 font-medium px-2">
                                                접수 번호 : <span>{complaint.complaint_number}</span>
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>작성자:</span>
                                                    <span>{complaint.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>접수일:</span>
                                                    <span>{new Date(complaint.created_at).toISOString().replace('T', ' ').substring(0, 16)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>상태:</span>
                                                    <span>
                                                        <Badge
                                                            variant={complaint.status === "완료" ? "default" : "secondary"}
                                                        >
                                                            {complaint.status}
                                                        </Badge>
                                                    </span>
                                                </div>
                                            </div>
                                            <Button className="w-full mt-4" onClick={() => setSelectedComplaint(complaint)}>
                                                상세보기
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                        )}
                    </div>
                </div>

            </div>

            {/* 민원 상세 모달 */}
            <ComplaintDetailModal
                show={!!selectedComplaint}
                onClose={() => {
                    setSelectedComplaint(null); // ComplaintDetailModal 닫기
                    postComplaints(); // 데이터를 다시 로드
                }}
                complaint={selectedComplaint}
                onStatusChange={postComplaints} // 상태 변경 후 데이터 새로 고침
            />

            {/* 성공 메시지 모달 */}
            <ModalMSG
                show={showMessageModal}
                onClose={handleMessageModalClose}
                title="Success"
            >
                <p style={{ whiteSpace: 'pre-line' }}>
                    {message}
                </p>
            </ModalMSG>

            {/* 에러 메시지 모달 */}
            <ModalErrorMSG
                show={showErrorModal}
                onClose={handleErrorModalClose}
                title="Error"
            >
                <p style={{ whiteSpace: 'pre-line' }}>
                    {errorMessage}
                </p>
            </ModalErrorMSG>
        </div>
    );
};

export default ComplaintsDashboard;

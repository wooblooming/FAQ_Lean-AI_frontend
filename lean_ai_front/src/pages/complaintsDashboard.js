import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
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
    const [newStatus, setNewStatus] = useState('');

    // 메시지 모달 닫기 & 초기화
    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
    };

    // 에러 메시지 모달 닫기 & 초기화
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
                `${config.apiDomain}/api/complaints/`, 
                { storeID },
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

    const handleStatusChange = async (complaint_number, newStatus) => {
        try {
            await axios.patch(
                `${config.apiDomain}/api/complaints/${complaintId}/status/`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );
            setComplaints((prevComplaints) =>
                prevComplaints.map((complaint) =>
                    complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
                )
            );
            setMessage("상태가 성공적으로 업데이트되었습니다.");
            setShowMessageModal(true);
        } catch (error) {
            console.error("상태 업데이트 중 오류가 발생했습니다:", error);
            setErrorMessage("상태 업데이트 중 오류가 발생했습니다.");
            setShowErrorModal(true);
        }
    };

    const formatAuthorName = (fullName) => {
        if (!fullName || fullName.length === 0) {
            return '';
        }
        const firstCharacter = fullName[0];
        const remainingCharacters = 'O'.repeat(fullName.length - 1);
        return firstCharacter + remainingCharacters;
    };

    return (
        <div className="min-h-screen p-6 font-sans bg-violet-50">
            <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg" style={{ backgroundColor: '#fff' }}>
                <div className="flex items-center">
                    <ChevronLeft
                        className="h-6 w-6 md:h-8 md:w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-xl md:text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>민원 조회 및 관리</h1>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {complaints.map((complaint) => (
                        <Card key={`card-${complaint.id}`}>
                            <CardHeader key={`header-${complaint.id}`}>
                                <CardTitle key={`title-${complaint.id}`} className="text-xl" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                                    {complaint.title}
                                </CardTitle>
                                <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'NanumSquare' }}>
                                    접수 번호 : <span>{complaint.complaint_number}</span>
                                </p>
                            </CardHeader>
                            <CardContent key={`content-${complaint.id}`} style={{ fontFamily: 'NanumSquareBold' }}>
                                <div className="space-y-2 ">
                                    <div className="flex justify-between" key={`author-${complaint.id}`}>
                                        <span>작성자:</span>
                                        <span>{formatAuthorName(complaint.name)}</span>
                                    </div>
                                    <div className="flex justify-between" key={`date-${complaint.id}`}>
                                        <span>접수일:</span>
                                        <span>{new Date(complaint.created_at).toISOString().replace('T', ' ').substring(0, 16)}</span>
                                    </div>
                                    <div className="flex justify-between items-center" key={`status-${complaint.id}`}>
                                        <span>상태:</span>
                                        <span className="col-span-3">
                                            <Badge
                                                variant={complaint.status === "완료" ? "default" : "secondary"}
                                                onClick={() => setSelectedComplaint(complaint.id)}
                                                className="cursor-pointer"
                                            >
                                                {complaint.status}
                                            </Badge>
                                        </span>
                                    </div>
                                </div>
                                <Dialog key={`dialog-${complaint.id}`} onOpenChange={(isOpen) => !isOpen && setSelectedComplaint(null)}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full mt-4">상세보기</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader key={`dialog-header-${complaint.id}`}>
                                            <DialogTitle key={`dialog-title-${complaint.id}`}>{complaint.title}</DialogTitle>
                                            <DialogDescription id={`dialog-description-${complaint.id}`} className="text-sm text-muted-foreground">
                                                접수 번호 : <span>{complaint.complaint_number}</span>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-3 py-2">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <span className="font-bold">작성자:</span>
                                                <span className="col-span-3"> {formatAuthorName(complaint.name)}</span>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <span className="font-bold">접수일:</span>
                                                <span className='whitespace-nowrap'>{new Date(complaint.created_at).toISOString().replace('T', ' ').substring(0, 16)}</span>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <span className="font-bold">상태:</span>
                                                {selectedComplaint === complaint.id ? (
                                                    <div className="col-span-3 flex items-center space-x-4">
                                                        <select
                                                            value={newStatus}
                                                            onChange={(e) => setNewStatus(e.target.value)}
                                                            className="bg-gray-100 p-2 rounded text-center"
                                                        >
                                                            <option value="">변경 상태 선택</option>
                                                            <option value="접수">접수</option>
                                                            <option value="처리 중">처리 중</option>
                                                            <option value="완료">완료</option>
                                                        </select>
                                                        <Button
                                                            className='px-3 font-normal'
                                                            size="sm"
                                                            onClick={() => handleStatusChange(complaint.id, newStatus)}
                                                        >
                                                            변경
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Badge
                                                        variant={complaint.status === "완료" ? "default" : "secondary"}
                                                        onClick={() => setSelectedComplaint(complaint.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        {complaint.status}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <span className="font-bold">내용:</span>
                                                <span className="col-span-3">{complaint.content}</span>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
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

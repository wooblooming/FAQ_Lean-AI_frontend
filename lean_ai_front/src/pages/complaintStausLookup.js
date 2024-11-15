import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import VerificationModal from '../components/verificationModal';
import config from '../../config';

const ComplaintLookup = () => {
    const router = useRouter();
    const [complaintNum, setComplaintNum] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [successVerification, setSuccessVerification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [complaintDetails, setComplaintDetails] = useState(null);
    const [status, setStatus] = useState('접수')

    const stages = ['접수', '처리중', '완료']


    // 일반 메시지 모달 닫기 & 초기화
    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
    };

    // 에러 메시지 모달 닫기 & 초기화
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage('');
    };

    // 핸드폰 번호로 인증번호 전송 요청
    const handleSendCode = async () => {
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(phone)) {
            setErrorMessage('핸드폰 번호를 확인해 주세요');
            setShowErrorMessageModal(true);
            return;
        }

        try {
            const response = await axios.post(`${config.apiDomain}/public/send-code/`, {
                phone,
                type: 'complaint',
            });

            if (response.data.success) {
                setVerificationCode('');
                setShowCodeModal(true);
            } else {
                setErrorMessage(response.data.message);
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            setErrorMessage('인증 번호 요청 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    // 인증 확인 요청
    const handleVerifyCode = async () => {
        try {
            const response = await axios.post(`${config.apiDomain}/public/verify-code/`, {
                phone,
                code: verificationCode,
                type: 'complaint',
            });

            if (response.status === 200 && response.data.success) {
                setShowCodeModal(false);
                setSuccessVerification(true);
                fetchComplaintDetails(); // 인증 성공 후 민원 상세 조회
            } else {
                setErrorMessage(response.data.message || '알 수 없는 오류가 발생했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            setErrorMessage('인증 확인 중 네트워크 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
            setShowCodeModal(false);
        }
    };

    // 민원 상세 조회 요청
    const fetchComplaintDetails = async () => {
        try {
            const response = await axios.post(`${config.apiDomain}/public/complaint-customer/`, {
                complaint_number: complaintNum,
                phone,
            });

            if (response.status === 200 && response.data.success) {
                setComplaintDetails(response.data.complaint); // 성공적으로 민원 데이터 가져옴
            } else {
                setErrorMessage(response.data.message || '민원 조회에 실패했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            setErrorMessage('민원 조회 중 네트워크 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    const handleCodeModalClose = () => {
        setShowCodeModal(false);
        setVerificationCode('');
    };

    return (
        <div className="bg-violet-50 flex flex-col gap-3 items-center justify-center relative font-sans min-h-screen">
            <div className="bg-white px-4 py-6 space-y-4 rounded-lg shadow-lg max-w-full text-center relative" style={{ width: '430px' }}>
                <div className="flex items-center">
                    <ChevronLeft
                        className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                        민원 조회
                    </h1>
                </div>
                <div className='flex flex-col space-y-4 items-start text-left px-4' style={{ fontFamily: 'NanumSquare' }}>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-gray-700' style={{ fontFamily: 'NanumSquareBold' }}>접수번호</p>
                        <input
                            placeholder='접수번호를 입력해주세요'
                            value={complaintNum}
                            onChange={(e) => setComplaintNum(e.target.value)}
                            className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                        />
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <p className='text-gray-700' style={{ fontFamily: 'NanumSquareBold' }}>핸드폰번호</p>
                        <div className='flex flex-row space-x-3'>
                            <input
                                placeholder='- 없이 핸드폰번호를 입력해주세요'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                            />
                            <button
                                className="text-center bg-indigo-500 text-white rounded-lg px-2 py-1.5 whitespace-nowrap"
                                onClick={handleSendCode}
                                style={{ fontFamily: "NanumSquareBold" }}
                            >
                                인증번호 받기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 민원 상세 정보 */}
            {complaintDetails && (
                <div className="bg-white px-4 py-6 space-y-4 rounded-lg shadow-lg text-center relative" style={{ width: '430px' }}>
                    <div className='flex flex-col space-y-2 items-start' style={{ fontFamily: 'NanumSquare' }}>
                        <div name='header' className="flex flex-col items-start space-y-1 ">
                            <h2 className="text-2xl" style={{ fontFamily: "NanumSquareExtraBold" }}>{complaintDetails.title}</h2>
                            <p className="text-gray-600 font-medium px-2" style={{ fontFamily: "NanumSquareBold" }}>
                                접수 번호: <span >{complaintDetails.complaint_number}</span>
                            </p>
                        </div>
                        <div name='content' className="space-y-4 text-lg ">
                            <div name='personal-info' className='flex flex-col space-y-2 px-2'>
                                <div className="flex space-x-5 justify-even">
                                    <span className="text-left w-16">작성자:</span>
                                    <span >{complaintDetails.name}</span>
                                </div>
                                <div className="flex space-x-5 justify-even">
                                    <span className="text-left w-16">접수일:</span>
                                    <span >{complaintDetails.created_at}</span>
                                </div>
                            </div>
                            <div name='status' className='flex flex-col justify-start text-start space-y-2 '>
                                <h2 className="text-2xl" style={{ fontFamily: "NanumSquareExtraBold" }}>접수 현황</h2>
                                <div className='flex flex-col justify-center'>
                                <div className="flex justify-between">
                                    {stages.map((stage, index) => (
                                        <div key={stage} className="flex flex-col items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${stages.indexOf(status) >= index ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                                                    }`}
                                            >
                                                {stages.indexOf(status) > index ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <span className="mt-2 text-sm">{stage}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${((stages.indexOf(status) + 1) / stages.length) * 100}%` }}
                                    ></div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 핸드폰 인증번호 입력 모달 */}
            <VerificationModal
                isOpen={showCodeModal}
                onClose={handleCodeModalClose}
                onSubmit={handleVerifyCode}
                verificationCode={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                errorMessage={errorMessage}
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
                show={showErrorMessageModal}
                onClose={handleErrorMessageModalClose}
                title="Error"
            >
                <p style={{ whiteSpace: 'pre-line' }}>
                    {errorMessage}
                </p>
            </ModalErrorMSG>
        </div>
    );
};

export default ComplaintLookup;

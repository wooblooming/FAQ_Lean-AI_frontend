import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, Check } from 'lucide-react';
import axios from 'axios';
import { fetchPublicComplaintCustomer } from '../fetch/fetchPublicComplaintCustomer';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
import VerificationModal from '../components/modal/verificationModal';
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
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [complaintDetails, setComplaintDetails] = useState(null);
    const [status, setStatus] = useState('접수')
    const [answer, setAnswer] = useState('');

    const stages = ['접수', '처리 중', '완료']


    // 일반 메시지 모달 닫기 & 초기화
    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
    };

    // 에러 메시지 모달 닫기 & 초기화
    const handleErrorMessageModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const handleCodeModalClose = () => {
        setShowCodeModal(false);
        setVerificationCode('');
    };

    // 핸드폰 번호로 인증번호 전송 요청
    const handleSendCode = async () => {
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(phone)) {
            setErrorMessage('핸드폰 번호를 확인해 주세요');
            setShowErrorModal(true);
            return;
        }

        try {
            const response = await axios.post(`${config.apiDomain}/public/send-code/`, {
                phone,
                type: 'complaint',
                complaintNum
            });

            if (response.data.success) {
                setVerificationCode('');
                setShowCodeModal(true);
            } else {
                setErrorMessage(response.data.message || '알 수 없는 오류가 발생했습니다.');
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || '인증 번호 요청 중 오류가 발생했습니다.');
            setShowErrorModal(true);
        }
    };

    // 인증 확인 요청
    const handleVerifyCode = async () => {
        console.log('Sending complaintNum:', complaintNum); // 디버깅용
        try {
            const response = await axios.post(`${config.apiDomain}/public/verify-code/`, {
                phone,
                code: verificationCode,
                type: 'complaint',
                complaintNum
            });

            if (response.status === 200 && response.data.success) {
                setShowCodeModal(false);
                setSuccessVerification(true);
                fetchComplaintDetails(); // 인증 성공 후 민원 상세 조회
            } else {
                setErrorMessage(response.data.message || '알 수 없는 오류가 발생했습니다.');
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage('인증 확인 중 네트워크 오류가 발생했습니다.');
            setShowErrorModal(true);
            setShowCodeModal(false);
        }
    };

    // 민원 상세 조회 요청
    const fetchComplaintDetails = async () => {
        await fetchPublicComplaintCustomer(
            complaintNum,
            phone,
            setComplaintDetails,
            setErrorMessage,
            setShowErrorModal
        );
    };

    useEffect(() => {
        if (complaintDetails) {
            console.log(complaintDetails);
            setStatus(complaintDetails.status);
            setAnswer(complaintDetails.answer);
        }
    }, [complaintDetails]);

    return (
        <div className="min-h-screen p-6 font-sans bg-violet-50 space-y-3 flex flex-col items-center justify-center ">
            <div className="flex flex-col space-y-6 w-full md:w-1/2 items-start py-12 px-6 shadow-md rounded-lg bg-white">
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
                        <div className='flex flex-col space-y-1 md:flex-row md:space-x-3 px-2 md:px-0'>
                            <input
                                placeholder='- 없이 핸드폰번호를 입력해주세요'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border md:mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
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
                <div className="flex flex-col space-y-6 w-full md:w-1/2 items-start py-12 px-6 shadow-md rounded-lg bg-white">
                    <div className='flex flex-col space-y-2 items-start w-full ' style={{ fontFamily: 'NanumSquare' }}>
                        <div name='header' className="flex flex-col items-start space-y-1 ">
                            <h2 className="text-2xl" style={{ fontFamily: "NanumSquareExtraBold" }}>{complaintDetails.title}</h2>
                        </div>
                        <div name='content' className="space-y-4 text-lg w-full ">
                            <div name='personal-info' className='flex flex-col space-y-2 px-2'>
                                <div className="flex space-x-5 justify-even">
                                    <span className="text-left w-20 whitespace-nowrap">접수 번호:</span>
                                    <span >{complaintDetails.complaint_number}</span>
                                </div>
                                <div className="flex space-x-5 justify-even">
                                    <span className="text-left w-20">작성자:</span>
                                    <span >{complaintDetails.name}</span>
                                </div>
                                <div className="flex space-x-5 justify-even">
                                    <span className="text-left w-20">접수일:</span>
                                    <span >{complaintDetails.created_at}</span>
                                </div>
                                <div className="flex space-x-5 justify-even">
                                    <span className="text-left w-20 whitespace-nowrap">민원 내용:</span>
                                    <span className="text-left" style={{ width: '70%' }}>{complaintDetails.content}</span>
                                </div>
                                <div className="flex space-x-5 justify-even">
                                    <span className="text-left w-20">민원 답변:</span>
                                    <span >{complaintDetails.answer}</span>
                                </div>

                            </div>
                            <div name="status" className="flex flex-col justify-center text-start space-y-2 w-full ">
                                <h2 className="text-2xl" style={{ fontFamily: "NanumSquareExtraBold" }}>접수 현황</h2>
                                <div name="status-process" className="flex flex-col items-center space-y px-3 py-2 w-full">
                                    <div className="flex justify-between w-full max-w-md">
                                        {stages.map((stage, index) => (
                                            <div key={stage} className="flex flex-col items-center">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${stages.indexOf(status) >= index ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                                                        }`}
                                                >
                                                    {stages.indexOf(status) >= index ? (
                                                        <Check className="w-5 h-5" />
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </div>
                                                <span className="mt-2 text-sm">{stage}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 w-full h-2 bg-gray-200 rounded-full max-w-md">
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
                show={showErrorModal}
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

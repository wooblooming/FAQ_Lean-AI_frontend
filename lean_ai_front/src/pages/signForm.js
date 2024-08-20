import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import IdDuplicateCheckModal from '../components/duplicateCheckModal'; // 아이디 중복 검사 컴포넌트
import VerificationModal from '../components/verificationModal';     // 인증 모달 컴포넌트
import TermsOfServiceModal from '../components/termsOfServiceModal'; // 이용약관 컴포넌트
import MarketingModal from '../components/marketingModal'; // 마켓팅 및 광고 약관 컴포넌트
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', confirmPassword: '', name: '', dob: '',
        phone: '', verificationCode: '', email: '', businessName: '', address: ''
    });
    const [idDuplicateChecked, setIdDuplicateChecked] = useState(false); // ID 중복성
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showIdDulicateModal, setShowIdDulicateModal] = useState(false);
    const [CodeSent, setCodeSent] = useState(false); // 인증번호 전송 여부 확인
    const [showCodeModal, setShowCodeModal] = useState(false); // 인증번호 모달 열림 상태
    const [verificationError, setVerificationError] = useState(null); // 인증 오류 메시지
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showMarketingModal, setShowMarketingModal] = useState(false);
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // 회원가입 성공 모달 상태

    const router = useRouter();

    // ID 중복 검사 모달 열기
    const IdDuplicateCheck = () => {
        if (!formData.username) {
            setErrorMessage('아이디를 입력해 주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        console.log("ID Duplicate Check Modal Opened");
        setShowIdDulicateModal(true);
    };

    // ID 중복 검사 결과를 받아 처리하는 함수
    const handleIdCheckComplete = (isCheck) => {
        setIdDuplicateChecked(isCheck);
    };

    // 이용 약관 모달 열기
    const handleTermsCheckboxChange = () => {
        setShowTermsModal(true);
    };

    // 입력 필드 값 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 회원가입 처리 함수
    const handleSignup = async () => {
        const { username, password, confirmPassword, name, dob, phone, email, businessName, address } = formData;

        if (!username || !password || !confirmPassword || !name || !dob || !phone || !email || !businessName || !address) {
            setErrorMessage('모든 항목들을 기입해 주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        if (!idDuplicateChecked) {
            setErrorMessage('아이디 중복 확인을 해주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            setShowErrorMessageModal(true);
            return;
        }
        // 새로운 변수 dobFormatted로 변환된 날짜를 저장
        let dobFormatted = dob;

        // 날짜 형식 변환: YYMMDD -> YYYY-MM-DD
        if (dob.length === 6) {
            const yearPrefix = parseInt(dob.substring(0, 2)) > 50 ? '19' : '20'; // 예: 80년대 이전은 19XX, 이후는 20XX
            dobFormatted = `${yearPrefix}${dob.substring(0, 2)}-${dob.substring(2, 4)}-${dob.substring(4, 6)}`;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    dob: dobFormatted,  // 변환된 날짜 형식 사용
                    phone,
                    email,
                    store_name: businessName,  // businessName을 store_name으로 변경
                    store_address: address,    // address를 store_address로 변경
                }),
            });

            const data = await response.json();

            if (data.success) {
                setShowWelcomeModal(true);
            } else {
                setErrorMessage(data.message || '회원가입에 실패했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            // console.error('회원가입 오류:', error);
            setErrorMessage('회원가입 요청 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    // 에러 메시지 모달 닫기
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage(''); // 에러 메시지 초기화
    };

    // 환영 모달 닫기 시 로그인 페이지로 이동
    const handleWelcomeModalClose = () => {
        setShowWelcomeModal(false);
        router.push('/login');
    };

    // 인증번호 전송
    const handleSendCode = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/send-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: formData.phone, type: 'signup' }),
            });

            const data = await response.json();

            if (data.success) {
                setCodeSent(true);
                setShowCodeModal(true); // 인증 번호 전송 후 모달 열기
            } else {
                setErrorMessage(data.message);
                setShowErrorMessageModal(true); // 오류 메시지를 모달에 표시
        }
        } catch (error) {
            // console.error('인증 번호 요청 오류:', error);
            setErrorMessage('인증 번호 요청 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/verify-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    code: formData.verificationCode,
                    type: 'signup' 
                }),
            });

            const data = await response.json();

            if (data.success) {
                setShowCodeModal(false); // 인증 성공 시 모달 닫기
            } else {
                setVerificationError(data.message);
            }
        } catch (error) {
            console.error('인증 확인 오류:', error);
            setVerificationError('인증 확인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="bg-blue-100 flex flex-col items-center min-h-screen overflow-y-auto relative w-full">
            <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col mt-2 py-1.5 text-sm font-medium mb-2 " style={{ width: '400px' }}>
                <h1 className="text-3xl font-bold text-center mb-5 text-blue-400 mt-8">MUMUL</h1>
                <div className="space-y-2">
                    <div className='flex justify-start'>
                        <p className="text-red-500 text-sm font-bold">* 표시는 필수 입력 항목입니다.</p>
                    </div>
                    <div>
                        <label className="block text-gray-700" htmlFor="username">
                            <div className="flex items-center justify-end space-x-2.5">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="아이디"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="border px-4 py-2 border-gray-300 rounded-md w-64 "
                                    />
                                    <label htmlFor="user-id" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                                </div>
                                <button className="text-white bg-purple-400 rounded-md px-4 py-2 font-medium hover:bg-purple-500 w-28"
                                    onClick={IdDuplicateCheck}>
                                    중복확인
                                </button>
                            </div>
                        </label>
                        <p className="text-red-500 text-xs mt-2 font-medium text-start mb-3">영문 소문자와 숫자만을 사용해, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.</p>
                    </div>
                </div>

                <div>
                    <label className="flex items-center text-gray-700" htmlFor="password">
                        <div className="relative">
                            <input type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md"
                                style={{ width: '358px' }}
                            />
                            <label htmlFor="user-pw" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                    <p className="text-red-500 text-xs mt-1 font-medium text-start mb-3">영문 대문자와 소문자, 숫자, 특수문자 중 2가지 이상을 조합하여 8자~20자로 입력해주세요.</p>
                </div>

                <div>
                    <label className="flex items-center text-gray-700 mb-3" htmlFor="confirmPassword">
                        <div className="relative">
                            <input type="password"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md"
                                style={{ width: '358px' }}
                            />
                            <label htmlFor="user-pw" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                </div>

                <div className="flex space-x-2 mb-3">
                    <label className="flex items-center block text-gray-700">
                        <div className="relative ">
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="flex-grow border px-4 py-2 border-gray-300 rounded-md w-44"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                    <label className="flex items-center justify-end text-gray-700">
                        <div className="relative">
                            <input
                                type="text"
                                name="dob"
                                placeholder="생년월일(ex.880111)"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="flex-grow border px-4 py-2 border-gray-300 rounded-md w-44"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                </div>

                {/* 본인 인증 */}
                <div className="flex mb-3">
                    <label className="block text-gray-700">
                        <div className="flex items-center justify-end space-x-2.5">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="휴대폰 번호"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 border-gray-300 rounded-md w-64 "
                                />
                                <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                            </div>
                            <button className="text-white bg-purple-400 rounded-md py-2 font-medium hover:bg-purple-500 w-24 whitespace-nowrap"
                                onClick={handleSendCode}
                            >
                                인증번호 받기
                            </button>
                        </div>
                    </label>
                </div>

                <label className="flex text-gray-700 mb-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border px-4 py-2 border-gray-300 rounded-md"
                        style={{ width: '358px' }}
                    />
                </label>

                <label className="flex text-gray-700 mb-3">
                    <div className="relative">
                        <input
                            type="text"
                            name="businessName"
                            placeholder="업소명"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="border px-4 py-2 border-gray-300 rounded-md"
                            style={{ width: '358px' }}
                        />
                        <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                    </div>
                </label>

                <label className="flex text-gray-700 ">
                    <div className="relative">
                        <input
                            type="text"
                            name="address"
                            placeholder="주소"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="border px-4 py-2 border-gray-300 rounded-md"
                            style={{ width: '358px' }}
                        />
                        <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                    </div>
                </label>

                {/* 이용약관 체크박스와 라벨 */}
                <div className="flex items-center justify-center space-x-2 mt-4">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={handleTermsCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <label
                        className="text-sm font-medium underline hover:text-blue-600 cursor-pointer"
                        onClick={handleTermsCheckboxChange}
                    >
                        이용약관 및 개인정보 수집 동의(필수)
                    </label>
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <input
                        type="checkbox"
                        checked={marketingAccepted}
                        onChange={() => setMarketingAccepted(!marketingAccepted)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <label className="text-sm font-medium underline hover:text-blue-600" onClick={() => setShowMarketingModal(true)}>
                        마케팅 활용 동의 및 광고 수신 동의(선택)
                    </label>
                </div>

                <button
                    className="bg-gradient-to-r from-purple-400 to-blue-400 text-white py-2 px-4 rounded-md w-full mt-3 font-medium"
                    onClick={handleSignup}
                >
                    회원가입
                </button>


                <div className="mt-4 text-center text-gray-500">
                    <p>이미 계정이 있나요?
                        <Link href="/login" className="underline text-blue-500 p-1 m-1">로그인</Link>
                    </p>
                    <p className="mt-2 mb-2">
                        계정을 잊어버리셨나요?
                        <Link href="/findingId" className="underline text-blue-500 p-1 m-1">계정찾기</Link>
                    </p>
                </div>

                {/* ID 중복성 검사 결과 모달 */}
                <IdDuplicateCheckModal
                    show={showIdDulicateModal}
                    onClose={() => setShowIdDulicateModal(false)}
                    onIdCheckComplete={handleIdCheckComplete} // 중복 체크 결과를 전달받음
                    username={formData.username}
                />

                {/* 인증 모달 */}
                <VerificationModal
                    isOpen={showCodeModal}
                    onClose={() => setShowCodeModal(false)}
                    onSubmit={handleVerifyCode}
                    verificationCode={formData.verificationCode}
                    onChange={handleInputChange}
                    errorMessage={verificationError}
                />

                {/* 이용약관 모달 */}
                <TermsOfServiceModal
                    show={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                    onAgree={(isAgreed) => setTermsAccepted(isAgreed)}
                />

                {/* 마케팅 및 광고 모달 */}
                <MarketingModal
                    show={showMarketingModal}
                    onClose={() => setShowMarketingModal(false)}
                    onAgree={(isAgreed) => setMarketingAccepted(isAgreed)}
                />

                {/* 에러 메시지 모달 */}
                <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
                    <p>
                        {typeof errorMessage === 'object' ? (
                            Object.entries(errorMessage).map(([key, value]) => (
                                <span key={key}>
                                    {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}<br />
                                </span>
                            ))
                        ) : (
                            errorMessage
                        )}
                    </p>
                    <div className="flex justify-center mt-4">
                        <button onClick={handleErrorMessageModalClose} className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            확인
                        </button>
                    </div>
                </ModalErrorMSG>


                {/* 회원가입 성공 모달 */}
                <ModalMSG show={showWelcomeModal} onClose={handleWelcomeModalClose} title="Welcome">
                    <p>{formData.username}님 환영합니다!</p>
                    <div className="flex justify-center mt-4">
                        <button onClick={handleWelcomeModalClose} className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            확인
                        </button>
                    </div>
                </ModalMSG>
            </div>
        </div>
    );
};

export default Signup;

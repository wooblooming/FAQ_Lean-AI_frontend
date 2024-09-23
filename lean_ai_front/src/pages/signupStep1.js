import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import IdCheckModal from '../components/idCheckModal'; // 아이디 중복 검사 기능이 있는 컴포넌트
import VerificationModal from '../components/verificationModal'; // 핸드폰 인증 기능이 있는 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

const SignupStep1 = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', confirmPassword: '', name: '', dob: '', phone: '', verificationCode: '', email: ''
    });
    const [idChecked, setIdChecked] = useState(false); // 아이디 중복 검사 여부 저장
    const [codeSent, setCodeSent] = useState(false); // 인증 번호 전송 여부 저장
    const [passwordsMatch, setPasswordsMatch] = useState(true); // 비밀번호와 비밀번호 확인이 일치하는지 여부 저장 
    const [passwordValid, setPasswordValid] = useState(true); // 비밀번호가 정규식을 통과하는지 여부 저장    
    const [phoneError, setPhoneError] = useState(''); // 핸드폰 번호 에러 메시지 저장
    const [verificationError, setVerificationError] = useState(null); // 인증 번호 에러 메시지 저장    
    const [errorMessage, setErrorMessage] = useState(''); // 기타 에러 메시지 저장
    const [codeCheck, setCodeCheck] = useState(false); // 인증번호 확인 여부 저장
    const [showIdCheckModal, setShowIdCheckModal] = useState(false); // 아이디 중복 검사 모달 상태 관리   
    const [showCodeModal, setShowCodeModal] = useState(false); // 인증번호 입력 모달 상태 관리
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태 관리

    const router = useRouter();

    // 비밀번호와 비밀번호 확인 입력값이 일치하는지 확인
    useEffect(() => {
        setPasswordsMatch(formData.password === formData.confirmPassword);
    }, [formData.password, formData.confirmPassword]);

    // 비밀번호 유효성 검사 함수
    const validatePassword = (password) => {
        const hasUpper = /[A-Z]/.test(password); // 대문자 포함 여부
        const hasLower = /[a-z]/.test(password); // 소문자 포함 여부
        const hasDigit = /\d/.test(password); // 숫자 포함 여부
        const hasSpecial = /[!@#$%^&*]/.test(password); // 특수문자 포함 여부
        const isValidLength = password.length >= 8 && password.length <= 20; // 길이 검사

        return isValidLength && (hasUpper + hasLower + hasDigit + hasSpecial >= 2); // 두 가지 이상의 조건을 만족하는지 검사
    };

    // 입력값에 대해 변화를 감지하여 상태 업데이트 및 추가적인 검증 로직 수행
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'password') {
            // 비밀번호 유효성 검사 수행
            setPasswordValid(validatePassword(value));
        }

        if (name === 'confirmPassword') {
            // 비밀번호 확인과 일치 여부 확인
            setPasswordsMatch(value === formData.password);
        }
    };

    // 인증번호 모달을 닫을 때 에러 메시지 초기화
    const handleCodeModalClose = () => {
        setShowCodeModal(false);
        setVerificationError(null); // 에러 메시지 초기화
        setFormData({
            ...formData,
            verificationCode: '',  // 인증번호 입력값 초기화
        });
    };

    // 회원가입 버튼 클릭 시 필수 정보 확인 후 다음 페이지로 이동
    const handleNextStep = () => {
        const { username, password, confirmPassword, name, dob, phone } = formData;

        if (!username || !password || !confirmPassword || !name || !dob || !phone) {
            setErrorMessage('필수 항목들을 기입해주시길 바랍니다');
            setShowErrorMessageModal(true);
            return;
        }

        if (!idChecked) {
            setErrorMessage('아이디 중복 확인을 해주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        if (!codeCheck) {
            setErrorMessage('핸드폰 인증을 해주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        router.push({
            pathname: '/signupStep2',
            query: { ...formData },
        });
    };

    // 에러 메시지 모달을 닫음
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage('');
    };

    // 핸드폰 번호로 인증번호 전송 요청
    const handleSendCode = async () => {
        // 핸드폰 번호가 '-' 없이 11자리인지 확인하는 정규식 
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(formData.phone)) {
            setPhoneError('핸드폰 번호를 확인해 주세요');
            return;
        }

        setPhoneError('');

        // 인증 요청하여 백엔드에서 인증번호 전송 
        try {
            const response = await fetch(`${config.apiDomain}/api/send-code/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: formData.phone, type: 'signup' }),
            });

            const data = await response.json();

            if (data.success) {
                setCodeSent(true);
                setShowCodeModal(true);
                setVerificationError(null);  // 에러 메시지를 초기화
            } else {
                setPhoneError(data.message);
            }
        } catch (error) {
            setPhoneError('인증 번호 요청 중 오류가 발생했습니다.');
        }
    };

    // 받은 인증번호가 백엔드에서 보낸 인증번호와 일치하는지 확인
    const handleVerifyCode = async () => {
        try {
            const response = await fetch(`${config.apiDomain}/api/verify-code/`, {
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
                setShowCodeModal(false);
                setCodeCheck(true);
            } else {
                setVerificationError(data.message);
            }
        } catch (error) {
            setVerificationError('인증 확인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-100">
            <div className="bg-white p-8 rounded-md shadow-lg max-w-md w-full">
                {/* 상단 뒤로 가기 화살표와 회원가입 텍스트 */}
                <div className="flex items-center mb-6">
                    <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                        <ArrowLeft className="mr-2 text-2xl" /> {/* 화살표 아이콘 크기 조정 */}
                        <span className="text-xl font-bold text-violet-500">회원가입</span>
                    </Link>
                </div>
                {/* 환영 메시지 */}
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Mumul에 오신 것을 환영합니다!</h1>
                <p className="mb-4 text-gray-600 ">더 나은 서비스를 위해 여러분의 기본 정보를 입력해주세요</p>

                {/* 아이디 입력 및 중복 확인 */}
                <div className="flex items-center justify-start mb-2 w-full space-x-4 ">
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            name="username"
                            placeholder="아이디"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="border px-4 py-2 border-gray-300 rounded-md w-full"
                        />
                        <label htmlFor="user-id" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                    </div>
                    <button className="flex items-center justify-end text-center bg-violet-500 text-white rounded-md px-4 py-2 font-medium whitespace-nowrap"
                        onClick={() => setShowIdCheckModal(true)}>
                        아이디 확인
                    </button>
                </div>
                <div>
                    {/* 비밀번호 입력 */}
                    <label className="flex items-center text-gray-700 w-full" htmlFor="password">
                        <div className="relative flex-grow">
                            <input type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md w-full"
                            />
                            <label htmlFor="user-pw" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                    {/* 비밀번호가 정규식에 적합한지 여부에 따라 출력 메시지가 달라짐 */}
                    {!passwordValid ? (
                        <p className="text-red-500 text-xs mt-1 font-medium mb-3">비밀번호가 8자 이상 영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상인지 확인해주세요</p>
                    ) : (
                        <p className="text-gray-500 text-xs mt-1 font-medium text-start mb-3 whitespace-pre-line ">영문 대문자와 소문자, 숫자, 특수문자 중 2가지 이상을 조합하여  8자~20자로 입력해주세요.</p>
                    )}
                </div>

                <div>
                    {/* 비밀번호 확인 입력 */}
                    <label className="flex items-center text-gray-700 mb-3 w-full" htmlFor="confirmPassword">
                        <div className="relative flex-grow">
                            <input type="password"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`border px-4 py-2 border-gray-300 rounded-md w-full ${!passwordsMatch ? 'border-red-500' : ''}`}
                            />
                            <label htmlFor="user-pw" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                    {/* 비밀번호와 비밀번호 확인란 입력값이 동일한지 확인 */}
                    {!passwordsMatch && (
                        <p className="text-red-500 text-xs mt-1 font-medium mb-3">비밀번호가 일치하지 않습니다.</p>
                    )}
                </div>

                <div className="flex space-x-2 mb-3">
                    <label className="flex items-center block text-gray-700 w-1/2">
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md w-full"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                    <label className="flex items-center justify-end text-gray-700 w-1/2">
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="dob"
                                placeholder="생년월일(ex.880111)"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md w-full"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                </div>

                <div className="flex mb-3 ">
                    <label className="block text-gray-700 w-full">
                        <div className="flex items-center justify-start space-x-2.5">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="휴대폰 번호( - 제외숫자만)"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 border-gray-300 rounded-md w-full "
                                />
                                <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                            </div>
                            <button className="flex items-center justify-end text-center bg-violet-500 text-white rounded-md px-2 py-2 font-medium whitespace-nowrap"
                                onClick={handleSendCode}
                            >
                                인증번호 받기
                            </button>
                        </div>
                        {/* 핸드폰 번호 오류 메시지 표시 */}
                        {phoneError && (
                            <p className="text-red-500 text-xs mt-1 font-medium ">{phoneError}</p>
                        )}
                    </label>
                </div>

                <div>
                    <label className="flex text-gray-700 mb-3 w-full">
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border px-4 py-2 border-gray-300 rounded-md w-full "
                        />
                    </label>
                </div>

                <button
                    className="w-full bg-violet-500 text-white py-2 rounded-md"
                    onClick={handleNextStep}
                >
                    다음
                </button>

                
            <div className="mt-4 text-center text-gray-500">
                <p>이미 계정이 있나요?
                    <Link href="/login" className="underline text-blue-500 p-1 m-1">로그인</Link>
                </p>
                <p className="mt-1.5 mb-2">
                    계정을 잊어버리셨나요?
                    <Link href="/findingId" className="underline text-blue-500 p-1 m-1">계정찾기</Link>
                </p>
            </div>

                {/* 아이디 중복 검사 및 정규식 적합 검사하는 모달 */}
                <IdCheckModal
                    show={showIdCheckModal}
                    onClose={() => setShowIdCheckModal(false)}
                    onIdCheckComplete={(isCheck) => {
                        setIdChecked(isCheck);
                        if (!isCheck) {
                            setErrorMessage('');
                        }
                    }}
                    username={formData.username}
                />

                {/* 핸드폰 이용하여 본인 인증하는 모달 */}
                <VerificationModal
                    isOpen={showCodeModal}
                    onClose={handleCodeModalClose}  // 에러 초기화를 위해 수정된 핸들러 사용
                    onSubmit={handleVerifyCode}
                    verificationCode={formData.verificationCode}
                    onChange={handleInputChange}
                    errorMessage={verificationError}
                />

                {/* 에러메시지 모달 */}
                <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
                    <p className='whitespace-pre-line'>
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
                </ModalErrorMSG>
            </div >
        </div>
    );
};

export default SignupStep1;

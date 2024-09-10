import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import IdCheckModal from '../components/idCheckModal'; // 아이디 중복 검사 기능이 있는 컴포넌트
import VerificationModal from '../components/verificationModal'; // 핸드폰 인증 기능이 있는 컴포넌트
import TermsOfServiceModal from '../components/termsOfServiceModal';
import MarketingModal from '../components/marketingModal';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

const Signup = () => {
    // 회원 가입 시 백엔드로 전송할 데이터를 관리
    const [formData, setFormData] = useState({
        username: '', password: '', confirmPassword: '', name: '', dob: '',
        phone: '', verificationCode: '', email: '', businessName: '', address: ''
    });

    const [idChecked, setIdChecked] = useState(false); // 아이디 중복 검사 여부 저장
    const [termsAccepted, setTermsAccepted] = useState(false); // 이용 약관 동의 여부 저장
    const [marketingAccepted, setMarketingAccepted] = useState(false); // 광고 및 마케팅 약관 동의 여부 저장
    const [codeSent, setCodeSent] = useState(false); // 인증 번호 전송 여부 저장
    const [passwordsMatch, setPasswordsMatch] = useState(true); // 비밀번호와 비밀번호 확인이 일치하는지 여부 저장 
    const [passwordValid, setPasswordValid] = useState(true); // 비밀번호가 정규식을 통과하는지 여부 저장    
    const [phoneError, setPhoneError] = useState(''); // 핸드폰 번호 에러 메시지 저장
    const [verificationError, setVerificationError] = useState(null); // 인증 번호 에러 메시지 저장    
    const [errorMessage, setErrorMessage] = useState(''); // 기타 에러 메시지 저장

    const [showIdCheckModal, setShowIdCheckModal] = useState(false); // 아이디 중복 검사 모달 상태 관리   
    const [showCodeModal, setShowCodeModal] = useState(false); // 인증번호 입력 모달 상태 관리
    const [showTermsModal, setShowTermsModal] = useState(false); // 이용약관 모달 상태 관리
    const [showMarketingModal, setShowMarketingModal] = useState(false); // 광고 및 마케팅 모달 상태 관리     
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // 가입 완료 및 환영 모달 상태 관리
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

    // 약관 동의 체크박스 클릭 시 이용약관 모달을 띄움
    const handleTermsCheckboxChange = () => {
        setShowTermsModal(true);
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

    // 회원가입 버튼 클릭 시 실행
    const handleSignup = async () => {
        const { username, password, confirmPassword, name, dob, phone, email, businessName, address } = formData;

        // 필수 입력 필드가 모두 입력되었는지 확인
        if (!username || !password || !confirmPassword || !name || !dob || !phone || !businessName || !address) {
            setErrorMessage('필수 항목들을 기입해주시길 바랍니다');
            setShowErrorMessageModal(true);
            return;
        }

        if (!idChecked) {
            setErrorMessage('아이디 중복 확인을 해주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        let dobFormatted = dob;

        if (dob.length === 6) {
            // YYMMDD 형식의 생년월일을 백엔드의 YYYY-MM-DD 형식으로 변환
            const yearPrefix = parseInt(dob.substring(0, 2)) > 24 ? '19' : '20';
            dobFormatted = `${yearPrefix}${dob.substring(0, 2)}-${dob.substring(2, 4)}-${dob.substring(4, 6)}`;
        } else {
            setErrorMessage("생년 월일을 YYMMDD 형태로 입력해 주세요");
            setShowErrorMessageModal(true);
        }

        // 입력값 백엔드로 전송
        try {
            const response = await fetch(`${config.apiDomain}/api/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    dob: dobFormatted,
                    phone,
                    email: email || null,  // 이메일이 없을 경우 null로 보냄
                    store_name: businessName,
                    store_address: address,
                }),
            });

            const data = await response.json();
            // 디버깅용: 서버로부터 받은 데이터를 출력
            // console.log(data);
            
            if (data.success) {
                setShowWelcomeModal(true);
            } else {
                setErrorMessage(data.message || '회원가입에 실패했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            setErrorMessage('회원가입 요청 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    // 에러 메시지 모달을 닫음
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage('');
    };

    // 회원가입 성공 후 환영 모달을 닫고 로그인 페이지로 이동
    const handleWelcomeModalClose = () => {
        setShowWelcomeModal(false);
        router.push('/login');
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
            } else {
                setVerificationError(data.message);
            }
        } catch (error) {
            setVerificationError('인증 확인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-center min-h-screen overflow-y-auto">
            <div className=" bg-white rounded-lg shadow-lg p-5 max-w-md m-7 w-11/12" style={{ maxWidth: '400px' }}>
                <h1 className="text-3xl font-bold text-violet-500 text-center mt-2 mb-4">MUMUL</h1>
                <div className="space-y-2">
                    <div className='flex justify-start'>
                        <p className="text-red-500 text-sm font-bold">* 표시는 필수 입력 항목입니다.</p>
                    </div>
                    {/* 아이디 입력 및 중복 확인 */}
                    <div>
                        <label className="block text-gray-700 w-full" htmlFor="username">
                            <div className="flex items-center justify-start space-x-2.5">
                                <div className="relative flex-grow">
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
                                <button className="flex items-center justify-end text-justify text-white bg-indigo-300 hover:bg-violet-500 rounded-md px-4 py-2 font-medium whitespace-nowrap"
                                    onClick={() => setShowIdCheckModal(true)}>
                                    아이디 확인
                                </button>
                            </div>
                        </label>
                        <p className="text-gray-500 text-xs mt-2 font-medium text-start mb-3 whitespace-pre-lne">영문 소문자와 숫자만을 사용해, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.</p>
                    </div>
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
                            <button className="flex items-center justify-end text-center text-white bg-indigo-300 hover:bg-violet-500 rounded-md px-2 py-2 font-medium whitespace-nowrap"
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

                <div>
                    <label className="flex text-gray-700 mb-3">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                name="businessName"
                                placeholder="매장명"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md  w-full"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                </div>

                <div>
                    <label className="flex text-gray-700 w-full">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                name="address"
                                placeholder="주소"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md w-full"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                </div>

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

                {/* 이용약관 보여주는 모달 */}
                <TermsOfServiceModal
                    show={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                    onAgree={(isAgreed) => setTermsAccepted(isAgreed)}
                />

                {/* 광고 및 마케팅 약관 보여주는 모달 */}
                <MarketingModal
                    show={showMarketingModal}
                    onClose={() => setShowMarketingModal(false)}
                    onAgree={(isAgreed) => setMarketingAccepted(isAgreed)}
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

                {/* 회원가입 성공 및 환영 모달 */}
                <ModalMSG show={showWelcomeModal} onClose={handleWelcomeModalClose} title="Welcome">
                    <p className=''>{formData.username}님 환영합니다!</p>
                </ModalMSG>
            </div>
        </div>
    );
};

export default Signup;

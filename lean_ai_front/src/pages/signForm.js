import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import IdDuplicateCheckModal from '../components/duplicateCheckModal'; // 아이디 중복 검사 컴포넌트
import TermsOfServiceModal from '../components/termsOfServiceModal'; // 이용약관 컴포넌트
import MarketingModal from '../components/marketingModal'; // 마켓팅 및 광고 약관 컴포넌트
import Modal from '../components/modal'; // 일반 모달 컴포넌트

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', confirmPassword: '', name: '', dob: '',
        phone: '', verificationCode: '', email: '', businessName: '', address: ''
    });

    const [idDuplicateChecked, setIdDuplicateChecked] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showIdDulicateModal, setShowIdDulicateModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showMarketingModal, setShowMarketingModal] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // 회원가입 성공 모달 상태

    const router = useRouter();

    // 아이디 중복 검사 모달 열기
    const IdDuplicateCheck = () => {
        setShowIdDulicateModal(true);
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
        const { username, password, confirmPassword, name, dob, phone, verificationCode, email, businessName, address } = formData;

        if (!username || !password || !confirmPassword || !name || !dob || !phone || !verificationCode || !email || !businessName || !address) {
            setErrorMessage('모든 필드를 입력해 주세요.');
            return;
        }

        if (!idDuplicateChecked) {
            setErrorMessage('아이디 중복 확인을 해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!termsAccepted) {
            setErrorMessage('이용약관 및 개인정보 수집 동의를 해야 합니다.');
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    marketingAccepted,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setShowWelcomeModal(true); // 회원가입 성공 시 환영 모달 열기
            } else {
                setErrorMessage(data.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            setErrorMessage('회원가입 요청 중 오류가 발생했습니다.');
        }
    };

    // 환영 모달 닫기 시 로그인 페이지로 이동
    const handleWelcomeModalClose = () => {
        setShowWelcomeModal(false);
        router.push('/login');
    };

    // 인증번호 받기 버튼 클릭 시 auth 페이지로 이동
    /* 백엔드 연동시 이용
    const handleAuthPageOpen = async () => {
        try {
            const response = await fetch('/api/start-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    returnUrl: `${window.location.origin}/complete`,
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                router.push('/auth'); // or open auth page in a new window
            } else {
                setErrorMessage('인증 요청 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('본인인증 요청 오류:', error);
            setErrorMessage('본인인증 요청 중 오류가 발생했습니다.');
        }
    };
    */
    const handleAuthPageOpen = async () => {
        try {
            // 시뮬레이션용 데이터 처리
            const mockResponse = {
                success: true,
                authToken: 'mockAuthToken12345', // 실제로는 서버에서 받아야 하는 값
            };
    
            if (mockResponse.success) {
                // 인증 페이지로 이동 (모의)
                console.log('Auth page opened with token:', mockResponse.authToken);
                router.push('/auth'); // 실제 인증 페이지로 이동
            } else {
                setErrorMessage('인증 요청 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('본인인증 요청 오류:', error);
            setErrorMessage('본인인증 요청 중 오류가 발생했습니다.');
        }
    };
    

    return (
        <div className="bg-blue-100 flex flex-col items-center min-h-screen overflow-y-auto relative w-full">
            <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center text-center mt-2 mb-4 py-1.5 w-1/3 text-sm font-bold mb-2">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-400 mt-12">LEAN AI</h1>

                <div className="space-y-4">
                    <div>
                        <label className="flex items-center block text-gray-700" htmlFor="username">
                            <input
                                type="text"
                                name="username"
                                placeholder="아이디"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="flex-grow border rounded-l-md px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                            <button className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2" onClick={IdDuplicateCheck}>
                                중복확인
                            </button>
                        </label>
                        <p className="text-red-500 text-sm mt-2">영문 소문자와 숫자만을 사용하여, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.</p>
                    </div>

                    <div>
                        <label className="flex items-center block text-gray-700 border rounded-md px-3 py-2" htmlFor="password">
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="ml-2 w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <p className="text-red-500 text-sm mt-1">영문 대문자와 소문자, 숫자, 특수문자 중 2가지 이상을 조합하여 8자~20자로 입력해주세요.</p>
                    </div>

                    <div>
                        <label className="flex items-center block text-gray-700 border rounded-md px-3 py-2" htmlFor="confirmPassword">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="ml-2 w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                    </div>

                    <div className="flex space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                name="dob"
                                placeholder="생년월일(ex.880111)"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                    </div>

                    {/* 본인 인증 */}
                    <div className="flex space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                name="phone"
                                placeholder="휴대폰 번호"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>

                        <button className="text-white bg-purple-400 rounded-md px-4 py-2" onClick={handleAuthPageOpen}>인증번호 받기</button>
                    </div>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="text"
                            name="businessName"
                            placeholder="업소명"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="text"
                            name="address"
                            placeholder="주소"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    {/* 이용약관 체크박스와 라벨 */}
                    <div className="flex items-center space-x-2 mt-4">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={handleTermsCheckboxChange}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label
                            className="text-sm underline hover:text-blue-600 cursor-pointer"
                            onClick={handleTermsCheckboxChange}
                        >
                            이용약관 및 개인정보 수집 동의(필수)
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={marketingAccepted}
                            onChange={() => setMarketingAccepted(!marketingAccepted)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label className="text-sm underline hover:text-blue-600" onClick={() => setShowMarketingModal(true)}>마케팅 활용 동의 및 광고 수신 동의(선택)</label>
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                    <button
                        className="bg-gradient-to-r from-purple-400 to-blue-400 text-white font-bold py-2 px-4 rounded-md w-full mt-6"
                        onClick={handleSignup}
                    >
                        회원가입
                    </button>
                </div>

                <div className="mt-6 text-center text-gray-500">
                    <p>이미 계정이 있나요?
                        <Link href="/login" className="underline text-blue-500 p-1 m-1">로그인</Link>
                    </p>
                    <p className="mt-2 mb-2">
                        계정을 잊어버리셨나요?
                        <Link href="/findingId" className="underline text-blue-500 p-1 m-1">계정찾기</Link>
                    </p>
                </div>
            </div>

            { /* ID 중복성 검사 결과 모달 */}
            <IdDuplicateCheckModal
                show={showIdDulicateModal}
                onClose={() => setShowIdDulicateModal(false)}
                idDuplicateChecked={(isCheck) => setIdDuplicateChecked(isCheck)}
                username={formData.username} // username을 모달에 전달
            />

            { /* 이용약관 모달 */}
            <TermsOfServiceModal
                show={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                onAgree={(isAgreed) => setTermsAccepted(isAgreed)}
            />

            { /* 마케팅 및 광고 모달 */}
            <MarketingModal
                show={showMarketingModal}
                onClose={() => setShowMarketingModal(false)}
                onAgree={(isAgreed) => setMarketingAccepted(isAgreed)}
            />

            {/* 회원가입 성공 모달 */}
            <Modal show={showWelcomeModal} onClose={handleWelcomeModalClose} title="">
                <p>{formData.username}님 환영합니다!</p>
                <div className="flex justify-center mt-4">
                    <button onClick={handleWelcomeModalClose} className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                        확인
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Signup;

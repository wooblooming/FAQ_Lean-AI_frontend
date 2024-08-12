import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Modal from '../components/modal'; // Modal 컴포넌트를 import

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showMarketingModal, setShowMarketingModal] = useState(false);

    const router = useRouter();

    const handleSignup = async () => {
        if (!username || !password || !confirmPassword || !name || !dob || !phone || !verificationCode || !email || !businessName || !address) {
            setErrorMessage('모든 필드를 입력해 주세요.');
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
                    username,
                    password,
                    name,
                    dob,
                    phone,
                    verificationCode,
                    email,
                    businessName,
                    address,
                    marketingAccepted,
                }),
            });

            const data = await response.json();
            if (data.success) {
                router.push('/login');
            } else {
                setErrorMessage(data.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            setErrorMessage('회원가입 요청 중 오류가 발생했습니다.');
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
                                placeholder="아이디"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex-grow border rounded-l-md px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                            <button
                                className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2"
                            >
                                중복확인
                            </button>
                        </label>
                        <p className="text-red-500 text-sm mt-2">영문 소문자와 숫자만을 사용하여, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.</p>
                    </div>

                    <div>
                        <label className="flex items-center block text-gray-700 border rounded-md px-3 py-2" htmlFor="password">
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="ml-2 w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <p className="text-red-500 text-sm mt-1">영문 대문자와 소문자, 숫자, 특수문자 중 2가지 이상을 조합하여 8자~20자로 입력해주세요.</p>
                    </div>

                    <div>
                        <label className="flex items-center block text-gray-700 border rounded-md px-3 py-2" htmlFor="confirmPassword">
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="ml-2 w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                    </div>

                    <div className="flex space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                placeholder="이름"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                placeholder="생년월일(ex.880111)"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                    </div>

                    <div className="flex space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                placeholder="휴대폰 번호"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <button className="text-white bg-purple-400 rounded-md px-4 py-2">인증번호 받기</button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2 mb-4">
                            <input
                                type="text"
                                placeholder="인증번호"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <p className="text-red-500">03:00</p>
                    </div>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="text"
                            placeholder="업소명"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="text"
                            placeholder="주소"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <div className="flex items-center space-x-2 mt-4">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label className="text-sm underline" onClick={() => setShowTermsModal(true)}>이용약관 및 개인정보 수집 동의(필수)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={marketingAccepted}
                            onChange={() => setMarketingAccepted(!marketingAccepted)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label className="text-sm underline" onClick={() => setShowMarketingModal(true)}>마케팅 활용 동의 및 광고 수신 동의(선택)</label>
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
                    <p className="mt-2">
                        계정을 잊어버리셨나요?
                        <Link href="/findingId" className="underline text-blue-500 p-1 m-1">계정찾기</Link>
                    </p>
                </div>
            </div>

            {/* 이용약관 모달 */}
            <Modal
                show={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title="이용약관 및 개인정보 수집 동의"
            >
                <p>여기에 이용약관 내용을 넣으세요.</p>
            </Modal>

            {/* 마케팅 활용 동의 모달 */}
            <Modal
                show={showMarketingModal}
                onClose={() => setShowMarketingModal(false)}
                title="마케팅 활용 동의 및 광고 수신 동의"
            >
                <p>여기에 마케팅 활용 동의 내용을 넣으세요.</p>
            </Modal>
        </div>
    );
};

export default Signup;

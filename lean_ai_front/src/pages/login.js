import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import naverIcon from '../../public/btn_naver.svg';
import kakaoIcon from '../../public/btn_kakao.svg';
import googleIcon from '../../public/btn_google.svg';
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
    };

    const handleLoginClick = async () => {
        if (!username || !password) {
            setErrorMessage('아이디와 비밀번호를 입력해 주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.access) {  // 서버 응답이 성공적이고 access 토큰이 존재하는 경우
                localStorage.setItem('token', data.access);  // 서버가 반환한 JWT 토큰 저장
                setIsLoggedIn(true);
                router.push('/mainPageForPresident');
            } else {
                setErrorMessage(data.error || '로그인에 실패했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            setErrorMessage('로그인 요청 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLoginClick();
        }
    };

    return (
        <div className="bg-blue-100 flex justify-center items-center h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md" style={{ width: '400px' }}>
                <h1 className="text-3xl font-bold text-blue-400 text-center mb-8">MUMUL</h1>
                <div className="space-y-4">
                    <div className="flex items-center border rounded-md px-4 py-2">
                        <FontAwesomeIcon icon={faUser} />
                        <input
                            type="text"
                            placeholder="아이디"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="ml-2 w-full border-none focus:ring-0"
                        />
                    </div>
                    <div className="flex items-center border rounded-md px-4 py-2">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="ml-2 w-full border-none focus:ring-0"
                            onKeyPress={handleKeyPress} // Enter 키를 누를 때 handleLoginClick을 호출
                        />
                    </div>
                    <button
                        className="bg-blue-200 text-black font-bold py-2 px-4 rounded-md w-full"
                        onClick={handleLoginClick}
                    >
                        로그인
                    </button>
                    <div className="text-center text-gray-500 my-4">
                        <span>또는</span>
                    </div>
                    <button className="text-black font-bold py-2 px-4 rounded-md w-full flex items-center justify-center" style={{ backgroundColor: '#FEE500' }}>
                        <span><Image src={kakaoIcon} className='mr-2 w-4 h-4' alt="kakao" /></span>카카오 계정으로 로그인
                    </button>
                    <button className="bg-white border text-black font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
                        <span><Image src={googleIcon} className='mr-2 w-3 h-3 ' alt="google" /></span> 구글 계정으로 로그인
                    </button>
                    <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
                        <span><Image src={naverIcon} className='mr-2 w-4 h-4' alt="naver" /></span>네이버 계정으로 로그인
                    </button>
                </div>
                <div className="mt-6 text-center text-gray-500 ">
                    <p>계정이 없나요?
                        <Link href="/signForm" className="underline p-1 m-1">회원가입</Link>
                    </p>
                    <p className="mt-2">
                        <Link href="/findingId" className="text-blue-500">아이디 찾기</Link>
                        {" | "}
                        <Link href="/findingPassword" className="text-blue-500">비밀번호 찾기</Link>
                    </p>
                </div>

                {/* 에러 메시지 모달 */}
                <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
                    <p style={{ whiteSpace: 'pre-line' }}>
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
                        <button onClick={handleErrorMessageModalClose} 
                                className="text-white bg-blue-300 rounded-md px-4 py-2 font-normal border-l hover:bg-blue-500 "
                        >
                            확인
                        </button>
                    </div>
                </ModalErrorMSG>
            </div>
        </div>
    );
};

export default Login;

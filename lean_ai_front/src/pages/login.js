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
import config from '../../config';

const Login = () => {
    const [username, setUsername] = useState(''); // 아이디 입력값을 저장
    const [password, setPassword] = useState(''); // 비밀번호 입력값을 저장
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달의 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지를 저장

    const router = useRouter();

    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false); // 에러 메시지 모달을 닫음
    };

    const handleLoginClick = async () => {
        try {
            const response = await fetch(`${config.apiDomain}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (!response.ok) {
                const data = await response.json(); // 서버의 에러 메시지 받기
                throw new Error(data.error || '로그인에 실패했습니다'); // 서버 에러 메시지 출력
            }
    
            const data = await response.json();
            sessionStorage.setItem('token', data.access);  // 토큰 저장
            router.push('/mainPageForPresident');
        } catch (error) {
            console.error('로그인 요청 중 오류 발생:', error);
            setErrorMessage(error.message); // 에러 메시지 설정
            setShowErrorMessageModal(true); // 에러 모달 표시
        }
    };
    
    // 로그인 시 Enter 키 사용
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLoginClick();
        }
    };

    return (
        <div className="bg-violet-50 flex justify-center items-center h-screen font-sans" >
            <div className=" bg-white rounded-lg shadow-lg p-8 max-w-md m-10" style={{ width: '400px' }}>
                <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8 cursor-pointer" 
                    style={{fontFamily:'NanumSquareExtraBold'}}
                    onClick={()=> router.push('/')}
                >
                    MUMUL
                </h1>
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
                            onKeyDown={handleKeyDown} // Enter 키를 누를 때 handleLoginClick 호출
                        />
                    </div>
                    <button
                        className="bg-indigo-500 text-white text-lg font-semibold py-2 px-4 rounded-full w-full"
                        onClick={handleLoginClick}
                    >
                        로그인
                    </button>
                    {/* <div className="text-center text-gray-500 my-4">
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
                    </button> */}
                </div>
                <div className="mt-4 text-center text-gray-500 ">
                    <p>
                        <Link href="/signupStep1" className="hover:underline text-blue-500 m-1">회원가입</Link>
                        {" | "}
                        <Link href="/findAccount" className="hover:underline text-blue-500 m-1">계정찾기</Link>
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
                </ModalErrorMSG>
            </div>
        </div>
    );
};

export default Login;

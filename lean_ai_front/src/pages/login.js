import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import naverIcon from '../../public/btn_naver.svg';
import kakaoIcon from '../../public/btn_kakao.svg';
import googleIcon from '../../public/btn_google.svg';
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import ConvertSwitch from '../components/convertSwitch';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPublicOn, setIsPublicOn] = useState(false); // 공공기관 스위치 상태

    const router = useRouter();
    const { saveToken } = useAuth();
    const { storeID, setStoreID } = useStore();

    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
    };

    // togglePublicOn 함수
    const togglePublicOn = () => {
        setIsPublicOn((prev) => !prev);
    };

    // 로그인 요청 함수
    const handleLoginClick = async () => {
        console.log("click");
        try {
            // isPublicOn 상태에 따라 URL 변경
            const url = isPublicOn 
                ? `${config.apiDomain}/public/login/`
                : `${config.apiDomain}/api/login/`;

            const response = await axios.post(url, {
                username,
                password,
            });

            const { access, store_id } = response.data;
            
            saveToken(access); // 전역 토큰 저장
            setStoreID(store_id); // storeID 설정
    
        } catch (error) {
            console.error('로그인 요청 중 오류 발생:', error);
            const errorMsg = error.response?.data?.error || '로그인에 실패했습니다';
            setErrorMessage(errorMsg);
            setShowErrorMessageModal(true);
        }
    };

    // storeID가 변경되었을 때 페이지 이동
    useEffect(() => {
        if (storeID) {
            router.push('/mainPageForPresident');
        }
    }, [storeID]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLoginClick();
        }
    };

    return (
        <div className="bg-violet-50 flex justify-center items-center h-screen font-sans">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md m-10" style={{ width: '400px' }}>
                <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8 cursor-pointer"
                    style={{ fontFamily: 'NanumSquareExtraBold' }}
                    onClick={() => router.push('/')}
                >
                    MUMUL
                </h1>
                <div className="space-y-4">
                    <ConvertSwitch  
                        isPublicOn={isPublicOn}
                        togglePublicOn={togglePublicOn} // toggle 함수 전달
                    />
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
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button
                        className="bg-indigo-500 text-white text-lg font-semibold py-2 px-4 rounded-full w-full"
                        onClick={handleLoginClick}
                    >
                        로그인
                    </button>
                </div>

                <div className="mt-4 text-center text-gray-500">
                    <p>
                        <Link href="/signupType" className="hover:underline text-blue-500 m-1">회원가입</Link>
                        {" | "}
                        <Link href="/findAccount" className="hover:underline text-blue-500 m-1">계정찾기</Link>
                    </p>
                </div>

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

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
<<<<<<< HEAD
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
=======
    // 사용자 입력 상태를 관리하는 useState 훅
    const [username, setUsername] = useState(''); // 아이디 입력 상태
    const [password, setPassword] = useState(''); // 비밀번호 입력 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리\
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

>>>>>>> 47ef5010f967a4b4a59e740ab93def1250bdc017

    const router = useRouter();

<<<<<<< HEAD
    const handleLoginClick = async () => {
        if (!username || !password) {
            alert('아이디와 비밀번호를 입력해 주세요.');
=======
    // 에러 메시지 모달 닫기
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage(''); // 에러 메시지 초기화
    };

    // 로그인 버튼 클릭 시 호출되는 함수
    const handleLoginClick = async () => {
        // 입력 검증: 아이디 또는 비밀번호가 입력되지 않은 경우 경고 메시지 표시
        if (!username) {
            setErrorMessage('아이디를 입력해 주세요.');
            setShowErrorMessageModal(true);
>>>>>>> 47ef5010f967a4b4a59e740ab93def1250bdc017
            return;
        }
        else if (!password) {
            setErrorMessage('비밀번호를 입력해 주세요.');
            setShowErrorMessageModal(true);
            return;
        }
        if (!username && !password) {
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

<<<<<<< HEAD
            const data = await response.json();

=======
            const data = await response.json(); // 서버 응답을 JSON 형태로 변환
            
>>>>>>> 47ef5010f967a4b4a59e740ab93def1250bdc017
            if (response.ok && data.access) {  // 서버 응답이 성공적이고 access 토큰이 존재하는 경우
                localStorage.setItem('token', data.access);  // 서버가 반환한 JWT 토큰 저장
                setIsLoggedIn(true);
                router.push('/mainPageForPresident');
            } else {
<<<<<<< HEAD
                alert(data.error || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 요청 중 오류가 발생했습니다.');
=======
                setErrorMessage('아이디 또는 비밀번호를 잘못 입력하였습니다. \n 입력하신 내용을 확인해주세요.'); // 로그인 실패 시 경고 메시지 표시
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            // console.error('로그인 오류:', error); // 오류 발생 시 콘솔에 출력
            setErrorMessage('로그인 요청 중 오류가 발생했습니다.'); // 오류 메시지 표시        
            setShowErrorMessageModal(true);
>>>>>>> 47ef5010f967a4b4a59e740ab93def1250bdc017
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
                        />
                    </div>
                    <button
                        className="bg-blue-200 text-black font-bold py-2 px-4 rounded-md w-full"
                        onClick={handleLoginClick}
                    >
                        로그인
                    </button>
<<<<<<< HEAD
                    <div className="text-center text-gray-500 my-4">
                        <span>또는</span>
=======

                    {/* 소셜 로그인 옵션 구분선 */}
                    <div className="flex flex-row items-center justify-center flex-nowrap">
                        <hr className="border-gray-300 my-4 w-2/5" />
                        <span className="text-gray-400 text-sm mx-2 whitespace-nowrap">또는</span>
                        <hr className="border-gray-300 my-4 w-2/5" />
>>>>>>> 47ef5010f967a4b4a59e740ab93def1250bdc017
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

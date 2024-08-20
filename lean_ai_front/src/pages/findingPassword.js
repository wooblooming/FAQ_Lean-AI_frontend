import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트

// FindPassword 함수형 컨포넌트 정의
function FindPassword() {
  // 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지
  const [formData, setFormData] = useState({ phone: '', verificationCode: '' });
  const [CodeSent, setCodeSent] = useState(false); // 인증번호 전송 여부 확인
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태


  const router = useRouter();

  // 입력 필드 값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 인증번호 전송
  const handleSendCode = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/send-code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone, type: 'findidpw' }),
      });

      const data = await response.json();

      if (data.success) {
        setCodeSent(true);
        setModalMessage('인증번호가 발송되었습니다!');
        setIsModalOpen(true); // 인증 번호 전송 후 모달 열기
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true); // 오류 메시지를 모달에 표시
      }
    } catch (error) {
      console.error('인증 번호 요청 오류:', error);
      setErrorMessage('인증 번호 요청 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true); // 오류 메시지를 모달에 표시
    }
  };

  // 인증번호 확인
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
          type: 'findidpw'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 세션 스토리지에 데이터 저장
        sessionStorage.setItem('userPassword', data.user_password);
        sessionStorage.setItem('dateJoined', data.date_joined);

        // 다음 페이지로 이동
        router.push('/findingPasswordResult');
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true); // 인증 오류 메시지를 모달에 표시
      }
    } catch (error) {
      console.error('인증 확인 오류:', error);
      setErrorMessage('인증 확인 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true); // 인증 오류 메시지를 모달에 표시
    }
  };

  // 모달 내 확인 버튼을 클릭했을 때 모달을 닫는 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage(''); // 모달 메시지 초기화
  };

  // 에러 메시지 모달 닫기
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage(''); // 에러 메시지 초기화
  };


  // 배경 및 창 설정
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-md shadow-md">

        {/* 뒤로가기 버튼 */}
        <div className="flex items-center mb-4">
          <Link href="/login" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          {/* 페이지 제목 */}
          <h1 className="text-xl font-bold flex-grow text-center">
            아이디/비밀번호 찾기
          </h1>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b mb-4">
          <Link href="/findingId" className="w-1/2 py-2 text-center text-black border-b-2 text-gray-500 font-semibold">
            아이디 찾기
          </Link>
          <button className="w-1/2 py-2 text-center text-red-500 border-b-2 border-red-500 font-semibold">
            비밀번호 찾기
          </button>
        </div>

        {/* 입력 탭 - 아이디 입력 필드 */}
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <input type="text" className="flex-grow border-b border-gray-300 p-2 focus:outline-none text-black" placeholder="아이디 입력" />
          </div>

          {/* 입력 탭 - 휴대폰 번호 입력 필드 */}
          {/* 인증번호 전송 */}
          <div className="mt-4">
            <div className="flex items-center mb-4">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
                placeholder="휴대폰 번호 입력('-' 제외)"
              />
              <button onClick={handleSendCode} className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded">
                인증번호 전송
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
                placeholder="인증번호 입력"
              />
              <button onClick={handleVerifyCode} className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded">
                확인
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모달창 */}
      <ModalMSG show={isModalOpen} onClose={handleCloseModal} title="알림">
        {modalMessage}
        <div className="flex justify-center mt-4">
          <button onClick={handleCloseModal} className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
            확인
          </button>
        </div>
      </ModalMSG>

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
    </div>
  );
}

// 컴포넌트 내보내기
export default FindPassword;

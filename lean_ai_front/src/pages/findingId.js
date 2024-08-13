import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Findid라는 함수형 컴포넌트 선언
function FindId() {

  const router = useRouter();

  // 모달이 열려있는지 여부를 관리하는 상태 (초기 상태를 닫는 상태로 함)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 인증번호 전송 버튼을 클릭했을 때 모달을 여는 함수
  const handleSendCode = () => {
    setIsModalOpen(true);
  };

  // 모달 내 확인 버튼을 클릭했을 때 모달을 닫는 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/findingIdResult');
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-md shadow-md">
        <div className="flex items-center mb-4">
          <a href="/login" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          {/* 페이지 제목 */}
          <h1 className="text-xl font-bold flex-grow text-center">아이디/비밀번호 찾기</h1>
        </div>

        {/* 탭 내비게이션 */}
        <div className="flex border-b">
          <button className="w-1/2 py-2 text-center text-red-500 border-b-2 border-red-500 font-semibold">
            아이디 찾기
          </button>
          <a href="/findingPassword" className="w-1/2 py-2 text-center text-gray-500">
            비밀번호 찾기
          </a>
        </div>

        {/* 인증번호 전송 */}
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <input type="text" className="flex-grow border-b border-gray-300 p-2 focus:outline-none" placeholder="휴대폰 번호 입력('-' 제외)" />
            <button onClick={handleSendCode} className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded">
              인증번호 전송
            </button>
          </div>

          <div className="flex items-center">
            <input type="text" className="flex-grow border-b border-gray-300 p-2 focus:outline-none" placeholder="인증번호 입력" />
            <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded">확인</button>
          </div>
        </div>
      </div>

      {/* 모달창 */}
      {isModalOpen && (
        <div id="modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-lg">
              인증번호가 발송되었습니다!
            </p>
            <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Findid내보내기
export default FindId;

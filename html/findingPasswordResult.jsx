import React from 'react';
import { useNavigate } from 'react-router-dom';

const PsFinder = () => {
  const navigate = useNavigate();

  return (
    // 페이지 배경 및 창 설정
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-md shadow-md">
        {/* 뒤로가기 기능 */}
        <div className="flex items-center mb-4">
          <a href="/login" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          {/* 페이지 제목 */}
          <h1 className="text-xl font-bold flex-grow text-center">아이디/비밀번호 찾기</h1>
        </div>
        
        {/* 탭 내비게이션 바 */}
        <div className="flex justify-between mb-4 border-b">
          <button
            className="flex-grow py-2 text-center"
            onClick={() => navigate('/IdFinder')}
          >
            아이디 찾기
          </button>
          <button className="flex-grow py-2 text-center text-red-500 border-b-2 border-red-500">
            비밀번호 찾기
          </button>
        </div>

        {/* 비밀번호 알림 내용 */}
        <div className="text-center">
          <p className="mb-4">휴대전화번호 정보와 일치하는 비밀번호 입니다.</p>
          {/* 박스 설정 및 박스 내용 */}
          <div className="border p-4 mb-4">
            <p>비밀번호 : password</p>
            <p>가입일 : 2024.02.01</p>
          </div>
        </div>
        {/* 확인 버튼 */}
        <a
          href="/login"
          className="w-full py-2 border border-black text-center block rounded-full cursor-pointer"
        >
          확인
        </a>
      </div>
    </div>
  );
};

export default PsFinder;

import React from 'react';

function FindIdPassword() {
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-md shadow-md">
        <div className="flex items-center mb-4">
          <a href="/login" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-xl font-bold flex-grow text-center">아이디/비밀번호 찾기</h1>
        </div>

        <div className="flex border-b">
          <button className="w-1/2 py-2 text-center text-red-500 border-b-2 border-red-500 font-semibold">아이디 찾기</button>
          <a href="/findingPassword" className="w-1/2 py-2 text-center text-gray-500">비밀번호 찾기</a>
        </div>

        <div className="mt-4">
          <div className="flex items-center mb-4">
            <input type="text" className="flex-grow border-b border-gray-300 p-2 focus:outline-none" placeholder="휴대폰 번호 입력('-' 제외)" />
            <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded">인증번호 전송</button>
          </div>

          <div className="flex items-center">
            <input type="text" className="flex-grow border-b border-gray-300 p-2 focus:outline-none" placeholder="인증번호 입력" />
            <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded">확인</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindIdPassword;

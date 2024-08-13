import React from 'react';
import Link from 'next/link';

const myPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        {/* 뒤로가기 버튼 */}
        <Link href="/mainPageForPresident" className="absolute top-4 left-4 text-gray-500 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
        </Link>

        {/* 프로필 이미지 */}
        <div className="mb-4">
          <img
            src="/user img2.jpg"
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">찬혁떡볶이</h2>
          <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg mt-2">
            프로필 변경
          </button>
        </div>

        {/* 버튼들 */}
        <div className="space-y-4 mt-6">
          <Link href="/editData" className="w-full">
              <button className="bg-gray-200 w-full text-lg py-4 rounded-lg">
                데이터 입력하러 가기
              </button>
          </Link>
          <Link href="/changeInfo">
          <button className="bg-gray-200 w-full text-lg py-4 rounded-lg mt-4">
            업종 정보 수정하기
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default myPage;
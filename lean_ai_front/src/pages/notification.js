import React from 'react';
import Link from 'next/link';

const NoticePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 상단 네비게이션 바 */}
      <nav className="flex items-center mb-4">
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
        <h1 className="text-xl font-bold ml-12">공지사항</h1>
      </nav>

      {/* 알림 전체 */}
      <div className="mb-4">
        <button className="text-lg font-semibold text-left">알림 전체</button>
      </div>

      {/* 공지사항 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
        <div className="bg-red-400 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4">
          L
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">기능 업데이트 안내 1.0</h2>
          <p className="text-sm text-gray-500">신규 버전 출시</p>
        </div>
        <div className="text-sm text-gray-400">2024.08.06</div>
      </div>
    </div>
  );
};

export default NoticePage;

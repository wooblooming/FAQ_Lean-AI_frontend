import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const IdFinder = () => {
  const router = useRouter();
  const { userId, dateJoined } = router.query;

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-md shadow-md">
        <div className="flex items-center mb-4">
          <Link href="/login" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold flex-grow text-center">아이디/비밀번호 찾기</h1>
        </div>

        <div className="flex justify-between mb-4 border-b">
          <button className="flex-grow py-2 font-bold text-center text-red-500 border-b-2 border-red-500">
            아이디 찾기
          </button>
          <Link href="/findingPassword" className="w-1/2 py-2 text-center text-gray-500">
            비밀번호 찾기
          </Link>
        </div>

        <div className="mt-4 text-center">
          <p className="mb-4">휴대전화번호 정보와 일치하는 아이디 입니다.</p>
          <div className="border p-4 mb-4">
            <p>아이디 : {userId}</p>
            <p>가입일 : {dateJoined}</p>
          </div>
        </div>

        <Link href="/login" className="w-full py-2 border border-black text-center block rounded-full cursor-pointer">
          확인 
        </Link>
      </div>
    </div>
  );
};

export default IdFinder;

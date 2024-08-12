import React from 'react';
import Link from 'next/link'; // Next.js의 Link 컴포넌트를 사용하여 클라이언트 사이드 네비게이션 처리
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome 아이콘 컴포넌트 사용
import { faUser, faLock} from '@fortawesome/free-solid-svg-icons'; // 사용될 아이콘 임포트

const Login = () => {
  return (
    <div className="bg-blue-100 flex justify-center items-center h-screen">
      {/* 로그인 폼을 중앙에 배치하는 전체 창 */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* 앱의 타이틀 */}
        <h1 className="text-3xl font-bold text-center mb-8">LEAN AI</h1>
        
        {/* 입력 필드 및 로그인 옵션들을 감싸는 컨테이너 */}
        <div className="space-y-4">
          
          {/* 아이디 입력 필드 */}
          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faUser} /> {/* 사용자 아이콘 */}
            <input 
              type="text" 
              placeholder="아이디" 
              className="ml-2 w-full border-none focus:ring-0" 
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faLock} /> {/* 잠금 아이콘 */}
            <input 
              type="password" 
              placeholder="비밀번호" 
              className="ml-2 w-full border-none focus:ring-0" 
            />
          </div>

          {/* 로그인 버튼 */}
          <button className="bg-blue-200 text-black font-bold py-2 px-4 rounded-md w-full">
            로그인
          </button>

          {/* 소셜 로그인 옵션 구분선 */}
          <div className="text-center text-gray-500 my-4">
            <span>또는</span>
          </div>

          {/* 카카오 계정으로 로그인 버튼 */}
          <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
            카카오 계정으로 로그인
          </button>

          {/* 구글 계정으로 로그인 버튼 */}
          <button className="bg-white border text-black font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
            구글 계정으로 로그인
          </button>

          {/* 네이버 계정으로 로그인 버튼 */}
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
            네이버 계정으로 로그인
          </button>
        </div>

        {/* 하단의 추가 링크들: 회원가입, 아이디 찾기, 비밀번호 찾기 */}
        <div className="mt-6 text-center text-gray-500">
          <p>계정이 없나요? 
            <Link href="/signup" className="underline">회원가입</Link> {/* 회원가입 링크 */}
          </p>
          <p className="mt-2">
            <Link href="/findingId" className="text-blue-500">아이디 찾기</Link> {/* 아이디 찾기 링크 */}
            {" | "}
            <Link href="/findingPassword" className="text-blue-500">비밀번호 찾기</Link> {/* 비밀번호 찾기 링크 */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

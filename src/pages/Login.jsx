import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  return (
    <div className="bg-blue-100 flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">LEAN AI</h1>
        <div className="space-y-4">
          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faUser} />
            <input type="text" placeholder="아이디" className="ml-2 w-full border-none focus:ring-0" />
          </div>
          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faLock} />
            <input type="password" placeholder="비밀번호" className="ml-2 w-full border-none focus:ring-0" />
          </div>
          <button className="bg-blue-200 text-black font-bold py-2 px-4 rounded-md w-full">
            로그인
          </button>
          <div className="text-center text-gray-500 my-4">
            <span>또는</span>
          </div>
          <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
            <i className="fab fa-kakao mr-2"></i> 카카오 계정으로 로그인
          </button>
          <button className="bg-white border text-black font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
            <i className="fab fa-google mr-2"></i> 구글 계정으로 로그인
          </button>
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-md w-full flex items-center justify-center">
            <i className="fab fa-naver mr-2"></i> 네이버 계정으로 로그인
          </button>
        </div>
        <div className="mt-6 text-center text-gray-500">
          <p>계정이 없나요? <Link to="/signup" className="underline">회원가입</Link></p>
          <p className="mt-2">
            <a href="/findid" className="text-blue-500">아이디 찾기</a>
            <a href="/findpassword" className="text-blue-500">비밀번호 찾기</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

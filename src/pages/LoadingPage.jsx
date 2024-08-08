import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후에 페이지 이동
    const timer = setTimeout(() => {
      navigate('/customer-introduce'); // 리다이렉션할 경로
    }, 5000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return (
    <div className="bg-white flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center flex flex-col items-center justify-center" style={{ transform: 'translateY(-20%)' }}>
        <img src={`${process.env.PUBLIC_URL}/loading.png`} className="w-48 h-52 object-contain mb-6" alt="Loading" />
        <p className="font-bold text-2xl">잠시만 기다려주세요!<br />해당 페이지로 이동 중입니다</p>
      </div>
    </div>
  );
};

export default LoadingPage;

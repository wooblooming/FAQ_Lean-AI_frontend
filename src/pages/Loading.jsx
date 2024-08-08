import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loading = () => {
  const navigate = useNavigate(); // useNavigate() : 페이지를 이동할 때 사용 

  useEffect(() => { // 컴포넌트가 렌더링될 때 특정 작업을 수행하도록 설정
    // 3초 후에 페이지 이동
    const timer = setTimeout(() => {
      navigate('/customer-introduce'); // 이동할 경로
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return (
    <div className="bg-white flex justify-center items-center min-h-screen">         {/* className은 css 설정 내용*/}
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center flex flex-col items-center justify-center" style={{ transform: 'translateY(-20%)' }}>
        <img src={`${process.env.PUBLIC_URL}/loading.png`} className="w-48 h-52 object-contain mb-6" alt="Loading" /> 
                    {/* process.env.PUBLIC_URL은 public 폴더의 기본 URL을 가져오는 데 사용 */}
        <p className="font-bold text-2xl">잠시만 기다려주세요!<br />해당 페이지로 이동 중입니다</p>
      </div>
    </div>
  );
};

export default Loading;

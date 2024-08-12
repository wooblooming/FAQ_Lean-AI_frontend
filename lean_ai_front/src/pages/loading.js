import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Loading = () => {
  // useRouter : 페이지를 이동할 때 사용
  const router = useRouter();

  // useEffect : 컴포넌트가 렌더링될 때 특정 작업을 수행하도록 설정
  useEffect(() => {
    // 3초 후에 페이지 이동
    const timer = setTimeout(() => {
      // router.push(이동할 경로)      
      router.push('/storeIntroduction'); 
    }, 3000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);

  }, [router]);

  return (
    <div className="bg-white flex justify-center items-center min-h-screen">         
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center flex flex-col items-center justify-center" style={{ transform: 'translateY(-20%)' }}>
        {/* 로딩 이미지 출력 */}
        <img src="/loading.png" className="w-48 h-52 object-contain mb-6" alt="Loading" />         
        
        {/* 로딩 중 멘트 출력 */}
        <p className="font-bold text-2xl">잠시만 기다려주세요!<br />해당 페이지로 이동 중입니다</p>
      </div>
    </div>
  );
};

export default Loading;
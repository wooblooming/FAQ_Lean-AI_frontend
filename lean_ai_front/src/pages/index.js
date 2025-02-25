import React, { useState, useEffect } from 'react';
import AnimationComponent from '@/components/component/mumul'; // 애니메이션 컴포넌트
import LandingPageContent from '@/components/component/landingPage/landingPageContent'; // 실제 랜딩 페이지 내용

const LandingPage = () => {
  const [showLandingPage, setShowLandingPage] = useState(false);

  useEffect(() => {
    // sessionStorage에서 애니메이션 실행 여부 확인
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      // 이미 방문한 적이 있으면 바로 랜딩 페이지 표시
      setShowLandingPage(true);
    }
  }, []);

  // 애니메이션이 끝나면 랜딩 페이지를 표시하고, sessionStorage에 값 저장
  const handleAnimationEnd = () => {
    setShowLandingPage(true);
    sessionStorage.setItem('hasVisited', 'true'); // 애니메이션 실행됨을 표시
  };

  return (
    <div>
      {showLandingPage ? (
        <LandingPageContent /> // 애니메이션이 끝난 후 실제 랜딩 페이지를 렌더링
      ) : (
        <AnimationComponent onAnimationEnd={handleAnimationEnd} /> // 애니메이션 실행
      )}
    </div>
  );
};

export default LandingPage;
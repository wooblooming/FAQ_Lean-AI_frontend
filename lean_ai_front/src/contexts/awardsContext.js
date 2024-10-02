import React, { createContext } from 'react';

export const AwardsContext = createContext();

export const AwardsProvider = ({ children }) => {
  const awardsContext = `    2020년 2020 4IR Awards AI부문 대상
    2019년 제 4회 서울혁신챌린지 최우수상(452개 참가 팀 중 1등)
    2019년 안암동 캠퍼스타운 창업경진대회 금상 (1등)
    2019년 2019 산업지능화 스타트업 창업경진대회 우수상 (2등)
    2018년 2018년 고려대 SW중심대학 창업경진대회 최우수상 (2등)
    2018년 SW시장성 테스트 지원사업 정보통신산업진흥원 원장상 (2등)
    2017년 2017 서울창업디딤터 대학생 창업동아리 성과 발표회 인기상
    2017년 2017 대학 창업유망팀 300 시제품 전시회 부총리겸 교육부 장관상 (1등)
    2017년 미래에셋대우 청년창업지원 프로젝트 최우수상 (1등)
    2017년 2017 고려대 크라우드펀딩 경진대회 장려상
    2017년 KU Lean Innovation Challenge&Startup 경진대회 Lean Startup상 (2등)
    2016년 제 17회 KU Campus&RnD CEO 경진대회 최우수상 (1등)
    2016년 제 1회 고려대 모의크라우드펀딩 경진대회 장려상  `;

  return (
    <AwardsContext.Provider value={awardsContext}>
      {children}
    </AwardsContext.Provider>
  );
};

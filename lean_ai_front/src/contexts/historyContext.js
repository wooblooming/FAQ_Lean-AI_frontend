import React, { createContext } from 'react';

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  // 연혁 데이터를 년도와 내용으로 구분하여 저장
  const historyContext = [
    { year: '2024년', content: '주식회사 린에이아이로 법인명 변경' },
    { year: '2022년', content: 'AI바우처지원사업 공급기업 선정' },
    { year: '2021년', content: '데이터바우처지원사업 공급기업 선정' },
    { year: '2018년', content: 'AI 학습용 데이터 수집/가공 플랫폼 \'린에이아이(LeanAI)\' 런칭' },
    { year: '2017년', content: '주식회사 잡쇼퍼 설립' }
  ];

  return (
    <HistoryContext.Provider value={historyContext}>
      {children}
    </HistoryContext.Provider>
  );
};

import React, { createContext } from 'react';

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const historyContext = `    2024년 주식회사 린에이아이로 법인명 변경
    2022년 AI바우처지원사업 공급기업 선정
    2021년 데이터바우처지원사업 공급기업 선정
    2018년 AI 학습용 데이터 수집/가공 플랫폼 '린에이아이(LeanAI)' 런칭
    2017년 주식회사 잡쇼퍼 설립  `;

  return (
    <HistoryContext.Provider value={historyContext}>
      {children}
    </HistoryContext.Provider>
  );
};

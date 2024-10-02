import React, { createContext } from 'react';

// Context 생성
export const BussinessContext = createContext();

// Provider 컴포넌트 정의
export const BussinessProvider = ({ children }) => {
  const bussinessContent = `    2024년 글로벌 기업 협업프로그램 선정 (마중-Microsoft 협업)
    2021~2024년 데이터바우처지원사업 32개사 AI학습용 데이터 수집/가공
    2022~2024년 AI바우처지원사업 26개사 AI솔루션 구축  `;

  return (
    <BussinessContext.Provider value={bussinessContent}>
      {children}
    </BussinessContext.Provider>
  );
};

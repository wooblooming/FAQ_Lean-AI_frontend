import React, { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // 필요에 따라 초기 상태를 설정하거나 원하는 값을 추가하세요.
  const [storeData, setStoreData] = useState({
    // 예시 데이터
    name: 'Default Store',
    location: 'Default Location',
  });

  return (
    <StoreContext.Provider value={{ storeData, setStoreData }}>
      {children}
    </StoreContext.Provider>
  );
};

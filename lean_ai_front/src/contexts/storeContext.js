import { createContext, useContext, useState, useEffect } from "react";
import { useLoginType } from "./loginTypeContext";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [storeID, setStoreID] = useState(null);
  const { loginType } = useLoginType();

  // sessionStorage에서 storeID, publicID, corporateID 가져와 초기화
  useEffect(() => {
    if (loginType === "public") {
      const savedPublicID = sessionStorage.getItem("publicID");
      if (savedPublicID) setStoreID(savedPublicID);
    } else if (loginType === "corporation") {
      const savedCorpID = sessionStorage.getItem("corpID");
      if (savedCorpID) setStoreID(savedCorpID);
    } else if (loginType === "store") {
      const savedStoreID = sessionStorage.getItem("storeID");
      if (savedStoreID) setStoreID(savedStoreID);
    }
  }, [loginType]); // ✅ loginType이 바뀔 때마다 실행
  


  // storeID, corporateID, publicID 저장하는 함수
  const saveStoreID = (id, type) => {
    setStoreID(id);

    if (type === "public") {
      sessionStorage.setItem("publicID", id);
      sessionStorage.removeItem("storeID");
      sessionStorage.removeItem("corpID");
    } else if (type === "corporation") {
      sessionStorage.setItem("corpID", id);
      sessionStorage.removeItem("storeID");
      sessionStorage.removeItem("publicID");
    } else {
      sessionStorage.setItem("storeID", id);
      sessionStorage.removeItem("publicID");
      sessionStorage.removeItem("corpID");
    }
  };

  // storeID, corporateID, publicID 초기화 함수
  const removeStoreID = () => {
    setStoreID(null);
    sessionStorage.removeItem("storeID");
    sessionStorage.removeItem("publicID");
    sessionStorage.removeItem("corpID");
  };

  return (
    <StoreContext.Provider
      value={{ storeID, setStoreID: saveStoreID, removeStoreID }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

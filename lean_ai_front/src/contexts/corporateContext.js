import { createContext, useContext, useState, useEffect } from "react";

const CorporateContext = createContext();

export const CorporateProvider = ({ children }) => {
  const [isCorporateOn, setIsCorporateOn] = useState(false);

  useEffect(() => {
    const storedCorporateStatus = sessionStorage.getItem("isCorporateOn");
    if (storedCorporateStatus) {
      setIsCorporateOn(JSON.parse(storedCorporateStatus));
    }
  }, []);

  const activateCorporate = () => {
    setIsCorporateOn(true);
    sessionStorage.setItem("isCorporateOn", "true");
  };

  const deactivateCorporate = () => {
    setIsCorporateOn(false);
    sessionStorage.removeItem("isCorporateOn");
  };

  return (
    <CorporateContext.Provider
      value={{
        isCorporateOn,
        setIsCorporateOn: activateCorporate,
        resetCorporateOn: deactivateCorporate,
      }}
    >
      {children}
    </CorporateContext.Provider>
  );
};

export const useCorporate = () => useContext(CorporateContext);

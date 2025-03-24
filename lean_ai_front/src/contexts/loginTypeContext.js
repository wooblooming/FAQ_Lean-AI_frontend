// contexts/loginTypeContext.js
import { createContext, useContext, useState, useEffect } from "react";

const LoginTypeContext = createContext();

export const LoginTypeProvider = ({ children }) => {
  const [loginType, setLoginType] = useState(null); // 'store' | 'corporation' | 'public'

  useEffect(() => {
    const saved = sessionStorage.getItem("loginType");
    if (saved) setLoginType(saved);
  }, []);

  useEffect(() => {
    if (loginType) {
      sessionStorage.setItem("loginType", loginType);
    }
  }, [loginType]);

  const resetLoginType = () => {
    setLoginType(null);
    sessionStorage.removeItem("loginType");
  };

  return (
    <LoginTypeContext.Provider value={{ loginType, setLoginType, resetLoginType }}>
      {children}
    </LoginTypeContext.Provider>
  );
};

export const useLoginType = () => useContext(LoginTypeContext);

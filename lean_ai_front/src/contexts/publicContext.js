import { createContext, useContext, useState, useEffect } from "react";

const publicContext = createContext();

export const PublicProvider = ({ children }) => {
  const [isPublicOn, setIsPublicOn] = useState(false);

  useEffect(() => {
    const storedPublicStatus = sessionStorage.getItem("isPublicOn");
    if (storedPublicStatus) {
      setIsPublicOn(JSON.parse(storedPublicStatus));
    }
  }, []);

  const activatePublic = () => {
    setIsPublicOn(true);
    sessionStorage.setItem("isPublicOn", "true");
  };
  const deactivatePublic = () => {
    setIsPublicOn(false);
    sessionStorage.removeItem("isPublicOn");
  };

  return (
    <publicContext.Provider
      value={{
        isPublicOn,
        setIsPublicOn: activatePublic,
        resetPublicOn: deactivatePublic,
      }}
    >
      {children}
    </publicContext.Provider>
  );
};

export const usePublic = () => useContext(publicContext);

import { createContext, useContext, useState, useEffect } from "react";

const CorporateContext = createContext(); // 🔥 대문자로 수정

export const CorporateProvider = ({ children }) => {
    const [isCorporateOn, setIsCorporateOn] = useState(false);

    useEffect(() => {
        const storedCorporateStatus = sessionStorage.getItem("isCorporateOn");
        if (storedCorporateStatus) {
            setIsCorporateOn(JSON.parse(storedCorporateStatus));
        }
    }, []);

    const toggleCorporateOn = () => {
        setIsCorporateOn((prev) => {
            const newStatus = !prev;
            sessionStorage.setItem("isCorporateOn", JSON.stringify(newStatus));
            return newStatus;
        });
    };

    const resetCorporateOn = () => {
        setIsCorporateOn(false);
        sessionStorage.removeItem("isCorporateOn");
    };

    return (
        <CorporateContext.Provider value={{ isCorporateOn, toggleCorporateOn, resetCorporateOn }}>
            {children}
        </CorporateContext.Provider>
    );
};

export const useCorporate = () => useContext(CorporateContext);

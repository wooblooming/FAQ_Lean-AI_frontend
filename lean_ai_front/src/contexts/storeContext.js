import { createContext, useContext, useState, useEffect } from "react";
import { usePublic } from "./publicContext";
import { useCorporate } from "./corporateContext";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [storeID, setStoreID] = useState(null);
    const { isPublicOn } = usePublic();
    const { isCorporateOn } = useCorporate();

    // sessionStorage에서 storeID, publicID, corporateID 가져와 초기화
    useEffect(() => {
        if (isPublicOn) {
            const savedPublicID = sessionStorage.getItem("publicID");
            if (savedPublicID) setStoreID(savedPublicID);
        } else if (isCorporateOn) {
            const savedCorporateID = sessionStorage.getItem("corporateID");
            if (savedCorporateID) setStoreID(savedCorporateID);
        } else {
            const savedStoreID = sessionStorage.getItem("storeID");
            if (savedStoreID) setStoreID(savedStoreID);
        }
    }, [isPublicOn, isCorporateOn]);

    // storeID, corporateID, publicID 저장하는 함수
    const saveStoreID = (id, type) => {
        setStoreID(id);

        if (type === "public") {
            sessionStorage.setItem("publicID", id);
            sessionStorage.removeItem("storeID");
            sessionStorage.removeItem("corporateID");
        } else if (type === "corporate") {
            sessionStorage.setItem("corporateID", id);
            sessionStorage.removeItem("storeID");
            sessionStorage.removeItem("publicID");
        } else {
            sessionStorage.setItem("storeID", id);
            sessionStorage.removeItem("publicID");
            sessionStorage.removeItem("corporateID");
        }
    };

    // storeID, corporateID, publicID 초기화 함수
    const removeStoreID = () => {
        setStoreID(null);
        sessionStorage.removeItem("storeID");
        sessionStorage.removeItem("publicID");
        sessionStorage.removeItem("corporateID");
    };

    return (
        <StoreContext.Provider value={{ storeID, setStoreID: saveStoreID, removeStoreID }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);

import { createContext, useContext, useState, useEffect } from 'react';
import { usePublic } from './publicContext';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [storeID, setStoreID] = useState(null);
    const { isPublicOn } = usePublic();

    // sessionStorage에서 storeID 또는 publicID를 가져와 상태를 초기화
    useEffect(() => {
        const savedID = sessionStorage.getItem(isPublicOn ? "publicID" : "storeID");
        if (savedID) {
            setStoreID(savedID);
        }
    }, [isPublicOn]);

    // storeID 또는 publicID를 sessionStorage에 저장하는 함수
    const saveStoreID = (id) => {
        //console.log("🔄 [saveStoreID 호출됨]:", id);
        setStoreID(id);
        
        if (isPublicOn) {
            sessionStorage.setItem("publicID", id);
            sessionStorage.removeItem("storeID");
        } else {
            sessionStorage.setItem("storeID", id);
            sessionStorage.removeItem("publicID");
        }
    };
    

    // storeID 또는 publicID를 초기화하고 sessionStorage에서 제거하는 함수
    const removeStoreID = () => {
        setStoreID(null);
        sessionStorage.removeItem("storeID");
        sessionStorage.removeItem("publicID");
    };

    return (
        <StoreContext.Provider value={{ storeID, setStoreID: saveStoreID, removeStoreID }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);

// StoreProvider.js

import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [storeID, setStoreID] = useState(null);

    // sessionStorage에서 storeID를 가져와 상태를 초기화
    useEffect(() => {
        const savedStoreID = sessionStorage.getItem("storeID");
        if (savedStoreID) {
            setStoreID(savedStoreID);
        }
    }, []);

    // storeID를 sessionStorage에 저장하는 함수
    const saveStoreID = (id) => {
        setStoreID(id);
        sessionStorage.setItem("storeID", id);
    };

    // storeID를 초기화하고 sessionStorage에서 제거하는 함수
    const removeStoreID = () => {
        setStoreID(null);
        sessionStorage.removeItem("storeID");
    };

    return (
        <StoreContext.Provider value={{ storeID, setStoreID: saveStoreID, removeStoreID }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);

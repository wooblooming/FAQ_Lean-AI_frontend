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

    // storeID가 변경될 때 sessionStorage에 저장
    const saveStoreID = (id) => {
        setStoreID(id);
        sessionStorage.setItem("storeID", id);
    };

    return (
        <StoreContext.Provider value={{ storeID, setStoreID: saveStoreID }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);

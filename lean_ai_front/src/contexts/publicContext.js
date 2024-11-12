import { createContext, useContext, useState, useEffect } from 'react';

const publicContext = createContext();

export const PublicProvider = ({ children }) => {
    const [isPublicOn, setIsPublicOn] = useState(false);

    useEffect(() => {
        const storedPublicStatus = sessionStorage.getItem('isPublicOn');
        if (storedPublicStatus) {
            setIsPublicOn(JSON.parse(storedPublicStatus));
        }
    }, []);

    const togglePublicOn = () => {
        setIsPublicOn((prev) => {
            const newStatus = !prev;
            sessionStorage.setItem('isPublicOn', JSON.stringify(newStatus)); // 상태 변경 시 세션 스토리지에 저장
            return newStatus;
        });
    };

    const resetPublicOn = () => {
        setIsPublicOn(false);
        sessionStorage.removeItem('isPublicOn');
    };

    return (
        <publicContext.Provider value={{ isPublicOn, togglePublicOn, resetPublicOn }}>
            {children}
        </publicContext.Provider>
    );
};

export const usePublic = () => useContext(publicContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.ReactNativeWebView) {
            const storedToken = sessionStorage.getItem('token');
            const isLandingPage = router.pathname === '/'; // 랜딩 페이지
            const isStoreIntroductionPage = /^\/storeIntroduction\/\[[^\]]+\]$/.test(router.pathname); // /storeIntroduction/[slug] 패턴

            if (storedToken) {
                setToken(storedToken);
            } else if (!isLandingPage && !isStoreIntroductionPage) {
                router.push('/login'); // 토큰 없고, 예외 경로가 아니면 로그인 페이지로 이동
            }
        }
    }, [router.pathname]);

    const saveToken = (newToken) => {
        setToken(newToken);
        if (typeof window !== 'undefined' && !window.ReactNativeWebView) {
            sessionStorage.setItem('token', newToken);
        }
    };

    const removeToken = () => {
        setToken(null);
        if (typeof window !== 'undefined' && !window.ReactNativeWebView) {
            sessionStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ token, saveToken, removeToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

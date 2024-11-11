// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        //console.log("Token loaded on page load:", storedToken); // 추가된 로그
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const saveToken = (newToken) => {
        //console.log("Saving new token:", newToken); // 추가된 로그
        setToken(newToken);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('token', newToken);
        }
    };

    const removeToken = () => {
        //console.log("Removing token"); // 추가된 로그
        setToken(null);
        if (typeof window !== 'undefined') {
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

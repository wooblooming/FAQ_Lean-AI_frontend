import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        //console.log("Token loaded on page load:", storedToken);
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const saveToken = (newToken) => {
        //console.log("Saving new token:", newToken);
        setToken(newToken);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('token', newToken);
        }
    };

    const removeToken = () => {
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

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AppProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('auth-token'));
    const [userName, setUserName] = useState(sessionStorage.getItem('name') || '');
    const bearerToken = sessionStorage.getItem('auth-token');

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName, bearerToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AuthContext);
}

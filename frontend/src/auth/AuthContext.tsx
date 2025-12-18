// auth/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_INFO_KEY = "userInfo";

export interface UserInfo {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
}

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
    isAuthenticated: boolean;
}

interface AuthContextProps extends AuthState {
    setAuthData: (accessToken: string, refreshToken: string, user: UserInfo) => void;
    clearAuthData: () => void;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>(() => ({
        accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
        user: localStorage.getItem(USER_INFO_KEY)
            ? JSON.parse(localStorage.getItem(USER_INFO_KEY)!)
            : null,
        isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),
    }));

    const setAuthData = useCallback(
        (accessToken: string, refreshToken: string, user: UserInfo) => {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
            setAuth({ accessToken, refreshToken, user, isAuthenticated: true });
        },
        []
    );

    const clearAuthData = useCallback(() => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        setAuth({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
    }, []);

    const refreshAccessToken = useCallback(async () => {
        if (!auth.refreshToken) return false;
        try {
            const res = await fetch(`http://localhost:8080/auth/refresh?refreshToken=${auth.refreshToken}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Refresh failed");
            const data = await res.json();
            if (!auth.user) return false;
            setAuthData(data.accessToken, data.refreshToken, auth.user);
            return true;
        } catch {
            clearAuthData();
            return false;
        }
    }, [auth.refreshToken, auth.user, setAuthData, clearAuthData]);

    return (
        <AuthContext.Provider value={{ ...auth, setAuthData, clearAuthData, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to consume auth anywhere
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
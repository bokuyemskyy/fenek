import { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
    username: string;
    displayName: string;
    color: string;
    avatarUrl: string;
    isComplete: boolean;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    async function refreshUser() {
        try {
            const res = await fetch("http://localhost:8080/api/users/me", {
                credentials: "include",
            });
            if (!res.ok) throw new Error();
            setUser(await res.json());
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function refreshToken() {
        try {
            const res = await fetch("http://localhost:8080/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to refresh token");
            await refreshUser();
            return true;
        } catch {
            setUser(null);
            return false;
        }
    }

    function logout() {
        fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include",
        }).finally(() => setUser(null));
    }

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, loading, logout, refreshUser, refreshToken }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
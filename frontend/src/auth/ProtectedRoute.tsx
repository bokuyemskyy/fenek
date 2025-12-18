// auth/ProtectedRoute.tsx
import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, refreshAccessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated) {
                setAuthorized(false);
                setLoading(false);
                return;
            }

            const success = await refreshAccessToken();
            setAuthorized(success);
            setLoading(false);
        };

        checkAuth();
    }, [isAuthenticated, refreshAccessToken]);

    if (loading) return <div>Loading...</div>;
    if (!authorized) return <Navigate to="/login" replace />;

    return children;
};
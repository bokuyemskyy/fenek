import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { RouteAccess } from "./RouteAccess";
import type { JSX } from "react";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/Loading";

export default function ProtectedRoute({ children, access }: { children: JSX.Element; access: RouteAccess }) {
    const { user, isAuthenticated, loading, refreshToken } = useAuth();
    const [attemptedRefresh, setAttemptedRefresh] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated && !attemptedRefresh) {
            refreshToken().finally(() => setAttemptedRefresh(true));
        }
    }, [isAuthenticated, attemptedRefresh, refreshToken, loading]);

    if (loading || (!isAuthenticated && !attemptedRefresh)) {
        return <LoadingScreen />;
    }

    if (access === RouteAccess.Public) return children;

    if (access === RouteAccess.GuestOnly) {
        return isAuthenticated ? <Navigate to="/chats" replace /> : children;
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (access === RouteAccess.CompleteProfile) {
        return user?.isComplete ? children : <Navigate to="/setup" replace />;
    }

    if (access === RouteAccess.IncompleteProfile) {
        return !user?.isComplete ? children : <Navigate to="/chats" replace />;
    }

    return children;
}
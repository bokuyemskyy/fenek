import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { RouteAccess } from "./RouteAccess";
import type { JSX } from "react";

export default function ProtectedRoute({
    children,
    access,
}: {
    children: JSX.Element;
    access: RouteAccess;
}) {
    const { user, isAuthenticated, loading } = useAuth();

    console.log(user, isAuthenticated);
    if (loading) return <div>Loading...</div>;

    if (access === RouteAccess.Public) return children;

    if (access === RouteAccess.GuestOnly) {
        return isAuthenticated
            ? <Navigate to="/chats" replace />
            : children;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (access === RouteAccess.CompleteProfile) {
        return user?.isComplete
            ? children
            : <Navigate to="/setup" replace />;
    }

    if (access === RouteAccess.IncompleteProfile) {
        return !user?.isComplete
            ? children
            : <Navigate to="/chats" replace />;
    }
    return children;
}
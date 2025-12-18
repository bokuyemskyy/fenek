import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserInfo } from "../auth/AuthContext";

export const LoginRedirect: React.FC = () => {
    const navigate = useNavigate();
    const { setAuthData } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const userParam = params.get("user");

        if (accessToken && refreshToken) {
            let user: UserInfo | null = null;

            if (userParam) {
                try {
                    user = JSON.parse(decodeURIComponent(userParam));
                } catch (err) {
                    console.error("Failed to parse user info from URL:", err);
                }
            }

            if (!user) {
                // fallback: minimal user info
                user = { id: "", email: "", displayName: "" };
            }

            setAuthData(accessToken, refreshToken, user);
            navigate("/chats", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, [navigate, setAuthData]);

    return <div>Logging in...</div>;
};
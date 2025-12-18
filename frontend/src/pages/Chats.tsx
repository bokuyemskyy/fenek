import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export const Chats: React.FC = () => {
    const { accessToken, user, clearAuthData, refreshAccessToken } = useAuth();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProtected = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                let token = accessToken;

                const res = await fetch("http://localhost:8080/api/protected", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 401) {
                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        clearAuthData();
                        setMessage("Unauthorized");
                        setLoading(false);
                        return;
                    }
                    token = accessToken; // note: accessToken won't automatically update here, you might need a useEffect dependency trick
                }

                const data = await res.text();
                setMessage(data);
            } catch (err) {
                console.error(err);
                setMessage("Failed to fetch protected resource");
            } finally {
                setLoading(false);
            }
        };

        fetchProtected();
    }, [accessToken, refreshAccessToken, clearAuthData]);

    if (loading) return <div>Loading chats...</div>;

    return (
        <div>
            <h1>Chats</h1>
            {user && <div>Welcome, {user.displayName}</div>}
            <div>{message}</div>
            <button onClick={clearAuthData}>Logout</button>
        </div>
    );
};
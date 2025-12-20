import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Chats() {
    const { user, logout } = useAuth();

    if (!user) return <p>Loading user info...</p>

    return (
        <div className="p-4">
            <h1>Welcome, {user.displayName || user.email}!</h1>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>

            <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                Logout
            </button>

            <div className="mt-8">
                <h2>Chat area</h2>
                <p>Here would go your messages...</p>
            </div>
        </div>
    )
}

// export const Chats: React.FC = () => {
//     const { accessToken, user, clearAuthData, refreshAccessToken } = useAuth();
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProtected = async () => {
//             if (!accessToken) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 let token = accessToken;

//                 const res = await fetch("http://localhost:8080/api/protected", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 if (res.status === 401) {
//                     const refreshed = await refreshAccessToken();
//                     if (!refreshed) {
//                         clearAuthData();
//                         setMessage("Unauthorized");
//                         setLoading(false);
//                         return;
//                     }
//                     token = accessToken; // note: accessToken won't automatically update here, you might need a useEffect dependency trick
//                 }

//                 const data = await res.text();
//                 setMessage(data);
//             } catch (err) {
//                 console.error(err);
//                 setMessage("Failed to fetch protected resource");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProtected();
//     }, [accessToken, refreshAccessToken, clearAuthData]);

//     if (loading) return <div>Loading chats...</div>;

//     return (
//         <div>
//             <h1>Chats</h1>
//             {user && <div>Welcome, {user.displayName}</div>}
//             <div>{message}</div>
//             <button onClick={clearAuthData}>Logout</button>
//         </div>
//     );
// };
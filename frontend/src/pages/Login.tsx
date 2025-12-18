import React from "react";

export const Login: React.FC = () => {
    const backendUrl = "http://localhost:8080";

    return (
        <div>
            <h1>Login</h1>
            <a href={`${backendUrl}/oauth2/authorization/google`}>
                <button>Login with Google</button>
            </a>
        </div>
    );
};
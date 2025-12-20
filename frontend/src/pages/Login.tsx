import React from "react";

export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <a href="http://localhost:8080/oauth2/authorization/github">
                Login with GitHub
            </a>
            <br></br>
            <a href="http://localhost:8080/oauth2/authorization/google">
                Login with Google
            </a>
        </div>
    );
};

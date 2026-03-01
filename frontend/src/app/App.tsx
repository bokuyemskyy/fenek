import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "@features/auth/LoginPage";
import SetupPage from "@features/auth/SetupPage";
import LandingPage from "@pages/LandingPage";

import { AuthProvider } from "@features/auth/AuthContext";
import { AuthenticatedRoute, GuestRoute, IncompleteProfileRoute, PublicRoute } from "./Routes";
import AppShell from "./AppShell";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                    <Route path="/setup" element={<IncompleteProfileRoute><SetupPage /></IncompleteProfileRoute>} />
                    <Route
                        path="/*"
                        element={
                            <AuthenticatedRoute>
                                <AppShell />
                            </AuthenticatedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

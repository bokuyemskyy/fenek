import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import SetupPage from "../pages/SetupPage";
import LandingPage from "../pages/LandingPage";

import { AuthProvider } from "../contexts/AuthContext";
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

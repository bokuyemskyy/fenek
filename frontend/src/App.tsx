import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import SetupPage from "./pages/SetupPage";
import LandingPage from "./pages/LandingPage";

import { RouteAccess } from "./types/route";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";
import { OverlayProvider } from "./contexts/OverlayContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute access={RouteAccess.Public}><LandingPage /></ProtectedRoute>} />
          <Route path="/login" element={<ProtectedRoute access={RouteAccess.GuestOnly}><LoginPage /></ProtectedRoute>} />
          <Route path="/chats" element={
            <ProtectedRoute access={RouteAccess.CompleteProfile}>
              <UserProvider>
                <ChatProvider>
                  <OverlayProvider>
                    <ChatsPage />
                  </OverlayProvider>
                </ChatProvider>
              </UserProvider>
            </ProtectedRoute>} />
          <Route path="/setup" element={<ProtectedRoute access={RouteAccess.IncompleteProfile}><SetupPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

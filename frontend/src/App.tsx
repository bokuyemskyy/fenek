import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import LandingPage from "./pages/LandingPage";
import SetupPage from "./pages/SetupPage";

import { RouteAccess } from "./types/route";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AppProviders } from "./contexts/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute access={RouteAccess.Public}><LandingPage /></ProtectedRoute>} />
          <Route path="/login" element={<ProtectedRoute access={RouteAccess.GuestOnly}><LoginPage /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute access={RouteAccess.CompleteProfile}><ChatsPage /></ProtectedRoute>} />
          <Route path="/setup" element={<ProtectedRoute access={RouteAccess.IncompleteProfile}><SetupPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AppProviders>
  );
};

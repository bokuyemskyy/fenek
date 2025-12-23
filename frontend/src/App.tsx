import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chats from "./pages/Chats";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Setup from "./pages/Setup";
import { RouteAccess } from "./auth/RouteAccess";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute access={RouteAccess.Public}><Landing /></ProtectedRoute>} />
          <Route path="/login" element={<ProtectedRoute access={RouteAccess.GuestOnly}><Login /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute access={RouteAccess.CompleteProfile}><Chats /></ProtectedRoute>} />
          <Route path="/setup" element={<ProtectedRoute access={RouteAccess.AuthOnly}><Setup /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chats from "./pages/Chats";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

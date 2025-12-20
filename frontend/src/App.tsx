import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chats from "./pages/Chats";
import { AuthProvider } from "./auth/AuthContext";
import Home from "./pages/Home";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

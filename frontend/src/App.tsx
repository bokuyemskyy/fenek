import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './auth/ProtectedRoute';
import { useKeycloak } from '@react-keycloak/web';

import WelcomePage from './pages/Welcome';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';

function App() {
  const { initialized } = useKeycloak();

  if (!initialized) return null;

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

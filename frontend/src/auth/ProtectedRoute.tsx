import { Navigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { keycloak, initialized } = useKeycloak();
    if (!initialized) return null;
    return keycloak?.authenticated ? <>{children}</> : <Navigate to="/" />;
}

export default ProtectedRoute;
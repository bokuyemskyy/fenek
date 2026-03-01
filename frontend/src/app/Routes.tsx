import ProtectedRoute, { RouteAccess } from "@features/auth/ProtectedRoute";

export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
    <ProtectedRoute access={RouteAccess.Public}>{children}</ProtectedRoute>
);

export const GuestRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
    <ProtectedRoute access={RouteAccess.GuestOnly}>{children}</ProtectedRoute>
);

export const AuthenticatedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
    <ProtectedRoute access={RouteAccess.AuthOnly}>{children}</ProtectedRoute>
);

export const IncompleteProfileRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
    <ProtectedRoute access={RouteAccess.IncompleteProfile}>{children}</ProtectedRoute>
);

export const CompleteProfileRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
    <ProtectedRoute access={RouteAccess.CompleteProfile}>{children}</ProtectedRoute>
);
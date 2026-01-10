import { AuthProvider } from "./AuthContext";
import { ChatProvider } from "./ChatContext";
import { UserProvider } from "./UserContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ChatProvider>
                <UserProvider>{children}</UserProvider>
            </ChatProvider>
        </AuthProvider>
    );
}
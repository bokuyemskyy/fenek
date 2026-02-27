import { Route, Routes } from "react-router-dom";

import { ChatProvider } from "../contexts/ChatContext";
import { OverlayProvider } from "../contexts/OverlayContext";
import { UserProvider } from "../contexts/UserContext";
import ChatsPage from "../pages/ChatsPage";
import { RootOverlay } from "../overlays/RootOverlay";

export default function AppShell() {
    return (
        <UserProvider>
            {/* <UserCacheProvider>
                <WebSocketProvider>
                    <ChatListProvider> */}
            <ChatProvider>
                <OverlayProvider>
                    <Routes>
                        <Route path="/chats" element={<ChatsPage />} />
                    </Routes>
                    <RootOverlay />
                </OverlayProvider>
            </ChatProvider>
            {/* </ChatListProvider>
                </WebSocketProvider >
            </UserCacheProvider > */}
        </UserProvider >
    );
}

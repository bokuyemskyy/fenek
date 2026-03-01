import { Route, Routes } from "react-router-dom";

import { OverlayProvider } from "@features/overlay/OverlayContext";
import { RootOverlay } from "@features/overlay/RootOverlay";
import { ChatProvider } from "@features/chat/ChatContext";
import { UserProvider } from "@features/user/UserContext";
import ChatsPage from "@features/chat/ChatsPage";

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

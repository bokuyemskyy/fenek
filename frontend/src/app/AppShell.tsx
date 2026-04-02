import { Route, Routes } from "react-router-dom";

import { OverlayProvider } from "@features/overlay/OverlayContext";
import { RootOverlay } from "@features/overlay/RootOverlay";
import { UserProvider } from "@features/user/UserContext";
import ChatsPage from "@features/chat/ChatsPage";
import { WebSocketProvider } from "@features/websocket/WebSocketContext";
import { useWsBridge } from "@features/websocket/wsBridge";

export default function AppShell() {

    function WsBridge() {
        useWsBridge();
        return null;
    }

    return (
        <UserProvider>
            <WebSocketProvider>
                <WsBridge />
                {/* <UserCacheProvider>
                <ChatListProvider> 
                <ChatProvider> */}
                <OverlayProvider>
                    <Routes>
                        <Route path="/chats" element={<ChatsPage />} />
                    </Routes>
                    <RootOverlay />
                </OverlayProvider>
            </WebSocketProvider>
        </UserProvider >
    );


}

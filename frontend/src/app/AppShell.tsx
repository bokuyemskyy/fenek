import { Route, Routes } from "react-router-dom";

import { OverlayProvider } from "@features/overlay/OverlayContext";
import { RootOverlay } from "@features/overlay/RootOverlay";
import ChatsPage from "@features/chat/ChatsPage";
import { WebSocketProvider } from "@features/websocket/WebSocketContext";
import { useWsBridge } from "@features/websocket/useWsBridge";
import { enableMapSet } from 'immer';

export default function AppShell() {

    function WsBridge() {
        useWsBridge();
        return null;
    }

    enableMapSet();

    return (
        <WebSocketProvider>
            <WsBridge />
            <OverlayProvider>
                <Routes>
                    <Route path="/chats" element={<ChatsPage />} />
                </Routes>
                <RootOverlay />
            </OverlayProvider>
        </WebSocketProvider>
    );


}

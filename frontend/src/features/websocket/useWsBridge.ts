import { useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";
import { useChatStore } from "../chat/chatStore";
import { WsEventType, type WsEvent } from "./ws";


export function useWsBridge() {
    const { subscribeToTopic, isConnected } = useWebSocket();
    const chats = useChatStore(s => s.chats);

    const store = useChatStore();

    useEffect(() => {
        if (!isConnected) return;
        const unsubs: (() => void)[] = [];

        chats.forEach((chat) => {
            const topic = `/topic/chat.${chat.id}`;
            const metadataTopic = `/topic/chat.${chat.id}.metadata`;

            const handleIncoming = (event: WsEvent) => {
                switch (event.event) {
                    case WsEventType.MESSAGE_CREATED: store.onMessageCreated(event.data as any); break;
                    case WsEventType.MESSAGE_UPDATED: store.onMessageUpdated(event.data as any); break;
                    case WsEventType.MESSAGE_DELETED: store.onMessageDeleted(event.data as any); break;
                    case WsEventType.REACTION_CREATED: store.onReactionCreated(event.data as any); break;
                    case WsEventType.REACTION_DELETED: store.onReactionDeleted(event.data as any); break;
                    case WsEventType.TYPING: store.onTyping(event.data as any); break;
                    // case WsEventType.ONLINE:
                    // case WsEventType.OFFLINE: store.onPresenceUpdate(event.data as any); break;
                }
            };

            unsubs.push(subscribeToTopic(topic, handleIncoming));
            unsubs.push(subscribeToTopic(metadataTopic, handleIncoming));
        });

        return () => {
            unsubs.forEach(unsub => unsub());
        };
    }, [chats, isConnected, subscribeToTopic, store]);
}
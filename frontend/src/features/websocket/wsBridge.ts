import { useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";
import { useChatStore } from "../chat/chatStore";
import type {
    MessageUpdatedEvent,
    MessageDeletedEvent,
    ReactionCreatedEvent,
    ReactionDeletedEvent,
    TypingStartedEvent,
    TypingStoppedEvent,
} from "./ws";

export function useWsBridge() {
    const { subscribe } = useWebSocket();

    const onMessageCreated = useChatStore(s => s.onMessageCreated);
    const onMessageUpdated = useChatStore(s => s.onMessageUpdated);
    const onMessageDeleted = useChatStore(s => s.onMessageDeleted);
    const onReactionCreated = useChatStore(s => s.onReactionCreated);
    const onReactionDeleted = useChatStore(s => s.onReactionDeleted);
    const onTypingStarted = useChatStore(s => s.onTypingStarted);
    const onTypingStopped = useChatStore(s => s.onTypingStopped);

    useEffect(() => {
        return subscribe((event) => {
            switch (event.event) {
                case "chats.message.created":
                    onMessageCreated(event.data as MessageUpdatedEvent); break;
                case "chats.message.updated":
                    onMessageUpdated(event.data as MessageUpdatedEvent); break;
                case "chats.message.deleted":
                    onMessageDeleted(event.data as MessageDeletedEvent); break;
                case "chats.reaction.created":
                    onReactionCreated(event.data as ReactionCreatedEvent); break;
                case "chats.reaction.deleted":
                    onReactionDeleted(event.data as ReactionDeletedEvent); break;
                case "realtime.typing.started":
                    onTypingStarted(event.data as TypingStartedEvent); break;
                case "realtime.typing.stopped":
                    onTypingStopped(event.data as TypingStoppedEvent); break;
            }
        });
    }, [subscribe]);
}
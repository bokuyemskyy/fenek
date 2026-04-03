export const WsEventType = {
    // Persistent
    MESSAGE_CREATED: "chats.message.created",
    MESSAGE_UPDATED: "chats.message.updated",
    MESSAGE_DELETED: "chats.message.deleted",
    REACTION_CREATED: "chats.reaction.created",
    REACTION_DELETED: "chats.reaction.deleted",
    CHAT_ADDED: "chats.chat.added",
    CHAT_REMOVED: "chats.chat.removed",
    CHAT_UPDATED: "chats.chat.updated",

    // Realtime
    TYPING: "realtime.typing",
    ONLINE: "realtime.online",
    OFFLINE: "realtime.offline",
} as const;

export type WsEventType = typeof WsEventType[keyof typeof WsEventType];

export interface MessageCreatedEvent {
    messageId: string;
    userId: string;
    chatId: string;
    content: string;
    createdAt: string;
    editedAt: string;
    replyToId?: string | null;
}

export interface MessageUpdatedEvent extends MessageCreatedEvent { }

export interface MessageDeletedEvent {
    messageId: string;
    userId: string;
    chatId: string;
}

export interface ReactionCreatedEvent {
    messageId: string;
    userId: string;
    chatId: string;
    emoji: string;
}

export interface ReactionDeletedEvent {
    messageId: string;
    userId: string;
    chatId: string;
}

export interface PresenceEvent {
    userId: string;
    chatId: string;
    online: boolean;
    lastSeen: string;
}

export interface TypingEvent {
    userId: string;
    chatId: string;
}

export type WsEventPayload =
    | MessageCreatedEvent
    | MessageUpdatedEvent
    | MessageDeletedEvent
    | ReactionCreatedEvent
    | ReactionDeletedEvent
    | PresenceEvent
    | TypingEvent;

export interface WsEvent<T = WsEventPayload> {
    event: WsEventType;
    data: T;
}

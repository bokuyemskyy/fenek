export interface MessageUpdatedEvent {
    messageId: string;
    userId: string;
    chatId: string;
    content: string;
    createdAt: string;
    editedAt: string;
    replyToId?: string | null;
}

export interface MessageDeletedEvent {
    messageId: string;
    userId: string;
    chatId: string;
    createdAt: string;
    editedAt: string;
    replyToId?: string | null;
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

export interface TypingStartedEvent {
    userId: string;
    chatId: string;
}

export interface TypingStoppedEvent {
    userId: string;
    chatId: string;
}

export type WsEventPayload =
    | MessageUpdatedEvent
    | MessageDeletedEvent
    | ReactionCreatedEvent
    | ReactionDeletedEvent
    | TypingStartedEvent
    | TypingStoppedEvent;

export interface WsEvent<T = WsEventPayload> {
    event: WsEventType;
    data: T;
}

export type WsEventType =
    | "chats.message.created"
    | "chats.message.updated"
    | "chats.message.deleted"
    | "chats.reaction.created"
    | "chats.reaction.deleted"
    | "realtime.typing.started"
    | "realtime.typing.stopped";
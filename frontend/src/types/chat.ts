export type ChatType = 'PRIVATE' | 'GROUP' | 'CHANNEL' | 'SAVED';

export interface ChatResponse {
    id: string;
    type: ChatType;

    // Optional because of JsonInclude.Include.NON_NULL in Java
    otherUserId?: string;
    title?: string;
    description?: string;
    imageUrl?: string;

    lastMessageSnippet?: string;
    lastMessageTimestamp?: string;
    createdAt: string;
}

export interface ChatUI {
    id: string;
    type: ChatType;
    title: string;
    description?: string;
    imageUrl?: string;
    lastMessage: string;
    timestamp?: string;
    otherUserId?: string;
}
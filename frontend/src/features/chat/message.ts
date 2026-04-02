export interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    editedAt?: string;
    replyToId?: string | null;
    pending?: boolean;
}

export type MessagePageResponse = {
    messages: Message[];
    nextCursor: number | null;
};
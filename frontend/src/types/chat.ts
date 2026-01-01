export interface Chat {
    id: string,
    title: string,
    description: string | null,
    lastMessage: string | null,
    timestamp: Date | null,
    avatarUrl: string | null,
    type: string,
    createdAt: Date,
}
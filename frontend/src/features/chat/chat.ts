import type { User } from "@features/user/user";

export type ChatType = 'PRIVATE' | 'GROUP' | 'CHANNEL' | 'SAVED';

export interface Chat {
    id: string;
    type: ChatType;
    // PRIVATE only
    otherUserId?: string;
    // GROUP only
    title?: string;
    description?: string;
    imageUrl?: string;
    // Common
    lastMessageSnippet?: string;
    lastMessageTimestamp?: string;
    createdAt: string;
}

export interface ChatDisplayInfo {
    title: string;
    avatarUrl?: string;
    color?: string;
}

export function getChatDisplayInfo(
    chat: Chat,
    registry: Record<string, User>
): ChatDisplayInfo {
    if (chat.type === "PRIVATE" && chat.otherUserId) {
        const user = registry[chat.otherUserId];
        return {
            title: user?.displayName ?? "Unknown",
            avatarUrl: user?.avatarUrl,
            color: user?.color,
        };
    }

    if (chat.type === "SAVED") {
        return {
            title: "Saved messages",
            avatarUrl: undefined,
            color: undefined,
        };
    }

    return {
        title: chat.title ?? "Untitled",
        avatarUrl: chat.imageUrl,
        color: undefined,
    };
}
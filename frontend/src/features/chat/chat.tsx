import type { AvatarProps } from "@components/Avatar";
import type { User } from "@features/user/user";
import { useUserStore } from "@features/user/userStore";
import { Bookmark } from "lucide-react";
import { useMemo } from "react";

export const ChatType = {
    PRIVATE: "PRIVATE",
    GROUP: "GROUP",
    CHANNEL: "CHANNEL",
    SAVED: "SAVED",
} as const;

export type ChatType = typeof ChatType[keyof typeof ChatType];

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
    avatarProps: AvatarProps;
}

export function getChatDisplayInfo(
    chat: Chat | undefined,
    registry: Record<string, User>
): ChatDisplayInfo {
    if (!chat) {
        return {
            title: "Unknown Chat",
            avatarProps: {}
        }
    }

    if (chat.type === ChatType.SAVED) {
        return {
            title: "Saved Messages",
            avatarProps: {
                icon: <Bookmark />
            }
        };
    }
    if (chat.type === ChatType.PRIVATE && chat.otherUserId) {
        const user = registry[chat.otherUserId];
        if (!user) {
            return {
                title: "Unknown User",
                avatarProps: {}
            }
        }
        return {
            title: user.displayName,
            avatarProps: {
                avatarUrl: user.avatarUrl,
                displayName: user.displayName,
                color: user.color,
            }
        };
    }

    return {
        title: chat.title ?? "Untitled",
        avatarProps: {
            avatarUrl: chat.imageUrl,
            displayName: chat.title,
            color: undefined,
        }
    };
}

export function useChatDisplayInfo(chat: Chat | undefined): ChatDisplayInfo {
    const registry = useUserStore(s => s.registry);

    return useMemo(() => getChatDisplayInfo(chat, registry), [chat, registry]);
} 
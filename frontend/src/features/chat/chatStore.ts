import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
    sendMessage as apiSend,
    editMessage as apiEdit,
    deleteMessage as apiDelete,
} from '@features/chat/messageService';
import type { Chat } from '@features/chat/chat';
import type { Message, MessagePageResponse } from '@features/chat/message';
import type { MessageCreatedEvent, MessageDeletedEvent, MessageUpdatedEvent, PresenceEvent, ReactionCreatedEvent, ReactionDeletedEvent, TypingEvent } from '@features/websocket/ws';
import { useUserStore } from '@features/user/userStore';

export interface Reaction {
    messageId: string;
    userId: string;
    emoji: string;
}

interface ChatState {
    chats: Chat[];
    selectedChatId: string | null;
    loadingChats: boolean;

    messages: Message[];
    hasMoreMessages: boolean;
    loadingMessages: boolean;
    nextCursor: number | null;

    typingUserIds: string[];
    reactions: Record<string, Reaction[]>;

    setChats: (chats: Chat[]) => void;
    selectChat: (chatId: string) => void;
    updateLastMessage: (chatId: string, snippet: string, timestamp: string) => void;
    prependChat: (chat: Chat) => void;

    setMessages: (messages: Message[]) => void;
    prependMessages: (messages: Message[]) => void;

    onMessageCreated: (event: MessageCreatedEvent) => void;
    onMessageUpdated: (event: MessageUpdatedEvent) => void;
    onMessageDeleted: (event: MessageDeletedEvent) => void;
    onReactionCreated: (event: ReactionCreatedEvent) => void;
    onReactionDeleted: (event: ReactionDeletedEvent) => void;
    onTyping: (event: TypingEvent) => void;

    _appendMessage: (message: Message) => void;
    _removeMessage: (messageId: string) => void;
    _updateMessage: (messageId: string, content: string, editedAt: string) => void;

    sendMessage: (chatId: string, content: string, replyToId?: string) => Promise<void>;
    editMessage: (messageId: string, content: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;

    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    loadMoreMessages: (chatId: string) => Promise<void>;
    selectChatAndLoad: (chatId: string) => Promise<void>;
    syncUserRegistry: () => void;
}

export const useChatStore = create<ChatState>()(
    immer((set, get) => ({

        chats: [],
        selectedChatId: null,
        loadingChats: false,
        messages: [],
        hasMoreMessages: true,
        loadingMessages: false,
        typingUserIds: [],
        reactions: {},
        nextCursor: null,


        setChats: (chats) => set((s) => { s.chats = chats; }),

        selectChat: (chatId) => set((s) => {
            s.selectedChatId = chatId;
            s.messages = [];
            s.typingUserIds = [];
            s.hasMoreMessages = true;
        }),

        updateLastMessage: (chatId, snippet, timestamp) => set((s) => {
            const chat = s.chats.find((c) => c.id === chatId);
            if (!chat) return;
            chat.lastMessageSnippet = snippet;
            chat.lastMessageTimestamp = timestamp;
            s.chats.sort((a, b) =>
                (b.lastMessageTimestamp ?? b.createdAt)
                    .localeCompare(a.lastMessageTimestamp ?? a.createdAt)
            );
        }),

        prependChat: (chat) => set((s) => { s.chats.unshift(chat); }),


        setMessages: (messages) => set((s) => { s.messages = messages; }),

        prependMessages: (messages) => set((s) => {
            s.messages.unshift(...messages);
            if (messages.length === 0) s.hasMoreMessages = false;
        }),


        _appendMessage: (message) => set((s) => {
            const idx = s.messages.findIndex((m) => m.id === message.id);
            if (idx !== -1) s.messages[idx] = message;
            else s.messages.push(message);
        }),

        _removeMessage: (messageId) => set((s) => {
            s.messages = s.messages.filter((m) => m.id !== messageId);
        }),

        _updateMessage: (messageId, content, editedAt) => set((s) => {
            const msg = s.messages.find((m) => m.id === messageId);
            if (!msg) return;
            msg.content = content;
            msg.editedAt = editedAt;
        }),

        onMessageCreated: (event) => {
            if (event.chatId !== get().selectedChatId) return;
            get()._appendMessage({
                id: event.messageId,
                senderId: event.userId,
                content: event.content,
                createdAt: event.createdAt,
                editedAt: event.editedAt,
                replyToId: event.replyToId,
            });
            get().updateLastMessage(event.chatId, event.content, event.createdAt);
        },

        onMessageUpdated: (event) => {
            if (event.chatId !== get().selectedChatId) return;
            get()._updateMessage(event.messageId, event.content, event.editedAt);
        },

        onMessageDeleted: (event) => {
            if (event.chatId !== get().selectedChatId) return;
            get()._removeMessage(event.messageId);
        },

        onReactionCreated: (event) => set((s) => {
            if (!s.reactions[event.messageId]) s.reactions[event.messageId] = [];
            const exists = s.reactions[event.messageId]
                .some((r) => r.userId === event.userId && r.emoji === event.emoji);
            if (!exists) s.reactions[event.messageId].push({
                messageId: event.messageId,
                userId: event.userId,
                emoji: event.emoji,
            });
        }),

        onReactionDeleted: (event) => set((s) => {
            if (!s.reactions[event.messageId]) return;
            s.reactions[event.messageId] = s.reactions[event.messageId]
                .filter((r) => r.userId !== event.userId);
        }),

        onTyping: (event) => set((s) => {
            if (event.chatId !== s.selectedChatId) return;
            if (!s.typingUserIds.includes(event.userId))
                s.typingUserIds.push(event.userId);
        }),

        sendMessage: async (chatId, content, replyToId) => {
            try {
                await apiSend(chatId, content, replyToId);
            } catch (err) {
                throw err;
            }
        },

        editMessage: async (messageId, content) => {
            const original = get().messages.find((m) => m.id === messageId);
            get()._updateMessage(messageId, content, new Date().toISOString());
            try {
                await apiEdit(messageId, content);
            } catch (err) {
                if (original) get()._updateMessage(messageId, original.content, original.editedAt ?? '');
                throw err;
            }
        },

        deleteMessage: async (messageId) => {
            const original = get().messages.find((m) => m.id === messageId);
            get()._removeMessage(messageId);
            try {
                await apiDelete(messageId);
            } catch (err) {
                if (original) get()._appendMessage(original);
                throw err;
            }
        },

        fetchChats: async () => {
            set((s) => { s.loadingChats = true; });
            try {
                const res = await fetch('/api/chats');
                if (!res.ok) throw new Error(await res.text());
                const chats: Chat[] = await res.json();
                get().setChats(chats);
                get().syncUserRegistry();
            } finally {
                set((s) => { s.loadingChats = false; });
            }
        },

        fetchMessages: async (chatId) => {
            set((s) => {
                s.loadingMessages = true;
                s.nextCursor = null;
            });

            try {
                const res = await fetch(`/api/chats/${chatId}/messages`);
                if (!res.ok) throw new Error(await res.text());

                const data: MessagePageResponse = await res.json();

                set((s) => {
                    s.messages = data.messages;
                    s.nextCursor = data.nextCursor;
                });

            } finally {
                set((s) => { s.loadingMessages = false; });
            }
        },

        loadMoreMessages: async (chatId) => {
            const { nextCursor, loadingMessages } = get();

            if (!nextCursor || loadingMessages) return;

            set((s) => { s.loadingMessages = true; });

            try {
                const res = await fetch(
                    `/api/chats/${chatId}/messages?before=${nextCursor}`
                );
                if (!res.ok) throw new Error(await res.text());

                const data: MessagePageResponse = await res.json();

                set((s) => {
                    s.messages = [...data.messages, ...s.messages];
                    s.nextCursor = data.nextCursor;
                });

            } finally {
                set((s) => { s.loadingMessages = false; });
            }
        },

        selectChatAndLoad: async (chatId: string) => {
            const { selectedChatId, fetchMessages } = get();

            if (selectedChatId === chatId) return;

            set((s) => {
                s.selectedChatId = chatId;
                s.messages = [];
                s.hasMoreMessages = true;
                s.nextCursor = null;
            });

            await fetchMessages(chatId);
        },

        syncUserRegistry: () => {
            const { chats } = get();
            const userIds = chats
                .filter(c => c.type === "PRIVATE" && c.otherUserId)
                .map(c => c.otherUserId as string);

            if (userIds.length > 0) {
                useUserStore.getState().requestUsers(userIds);
            }
        },
    }))
);

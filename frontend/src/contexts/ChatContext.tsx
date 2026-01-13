import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect
} from "react";
import type { Chat, ChatResponse } from "../types/chat";

interface ChatContextType {
    chats: Chat[];
    isLoading: boolean;

    activeChatId: string | null;
    setActiveChatId: (id: string | null) => void;

    reloadChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const fetchChats = useCallback(async () => {
        try {
            const response = await fetch(`/api/chats`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data: ChatResponse[] = await response.json();

                const formattedChats: Chat[] = data.map((dto) => ({
                    id: dto.id,
                    type: dto.type,
                    otherUserId: dto.otherUserId,
                    title: dto.title || (dto.type === 'PRIVATE' ? "Unknown User" : "Untitled Chat"),
                    description: dto.description,
                    imageUrl: dto.imageUrl,
                    lastMessage: dto.lastMessageSnippet || "No messages yet",
                    timestamp: dto.lastMessageTimestamp,
                }));

                setChats(formattedChats);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    return (
        <ChatContext.Provider
            value={{
                chats,
                isLoading,
                activeChatId,
                setActiveChatId,
                reloadChats: fetchChats
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChats() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
    registry: Chat;
    requestUsers: (userIds: string[]) => void;
}

const ChatContext = createContext(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [chat, setChat] = useState(null);

    const value = { chat, setChat };

    return (
        <ChatContext.Provider
            value={{ value }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used inside ChatProvider");
    return context;
}
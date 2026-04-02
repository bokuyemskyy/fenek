import { useState, useEffect, useRef } from "react";
import { Send, Smile } from "lucide-react";
import Avatar from "@components/Avatar";
import { useUser } from "@features/user/UserContext";
import { useChatStore } from '@features/chat/chatStore';
import { useAuth } from "@features/auth/AuthContext";
import type { ChatDisplayInfo } from "./chat";
import type { Message } from "./message";



export function ChatContent({ displayInfo }: { displayInfo: ChatDisplayInfo }) {
    const fetchMessages = useChatStore((state) => state.fetchMessages);
    const selectedChatId = useChatStore((state) => state.selectedChatId);
    if (!selectedChatId) return;
    useEffect(() => {
        fetchMessages(selectedChatId);
    }, []);

    const chatId = useChatStore((state) => state.selectedChatId);
    const chat = useChatStore((state) => state.chats).find((chat => chat.id === chatId));
    if (!chat) {
        return (
            <div className="flex-1 flex items-center justify-center text-white/30">
                <p>Chat not found</p>
            </div>
        );
    }

    const { user } = useAuth();

    const [messageInput, setMessage] = useState("");
    const messages = useChatStore((state) => state.messages);

    const sendMessage = useChatStore((state) => state.sendMessage);

    const handleSend = async () => {
        if (!messageInput.trim()) return;

        try {
            await sendMessage(chat.id, messageInput);
            setMessage("");
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const targetUserId = chat.type === 'PRIVATE' ? chat.otherUserId : undefined;
    const opponent = useUser(targetUserId);

    let isOnline = true;


    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Top Bar */}
            <div className="h-16 px-6 flex items-center gap-4 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                <div className="w-10 h-10 flex-shrink-0">
                    <Avatar
                        avatarUrl={displayInfo.avatarUrl}
                        displayName={displayInfo.title}
                        color={displayInfo.color}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-white truncate">{displayInfo.title}</h2>
                    <p className="text-xs text-white/40">
                        {isOnline ? (
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                online
                            </span>
                        ) : (
                            "offline"
                        )}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} isMine={message.senderId == user?.id} />
                ))}
            </div>

            {/* Bottom Input Bar */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                <div className="flex items-end gap-3">
                    <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/60 hover:text-white mb-0.5">
                        <Smile className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            value={messageInput}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 
                       focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all 
                       placeholder:text-white/40 text-white resize-none max-h-32
                       scrollbar-thin scrollbar-thumb-white/10"
                            style={{
                                minHeight: "44px",
                                maxHeight: "128px",
                            }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!messageInput.trim()}
                        className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 
                     hover:from-orange-600 hover:to-orange-700 transition-all 
                     shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 
                     disabled:hover:to-orange-600 mb-0.5"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}


function MessageBubble({ message, isMine }: { message: Message, isMine: boolean }) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[70%] rounded-3xl px-4 py-2.5 ${isMine
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-lg"
                    : "bg-white/10 text-white rounded-bl-lg border border-white/10"
                    }`}
            >
                <p className="text-sm leading-relaxed break-words">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                    <span
                        className={`text-[10px] ${isMine ? "text-white/70" : "text-white/40"
                            }`}
                    >
                        {message.createdAt}
                    </span>
                </div>
            </div>
        </div>
    );
}
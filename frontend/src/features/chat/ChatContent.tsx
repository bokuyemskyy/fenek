import { useState, useEffect, useRef } from "react";
import { Send, SendHorizonal, Smile } from "lucide-react";
import Avatar from "@components/Avatar";
import { useChatStore } from '@features/chat/chatStore';
import { useAuth } from "@features/auth/AuthContext";
import type { Message } from "./message";
import { formatDistanceToNow } from 'date-fns';
import { useUserStore } from "@features/user/userStore";
import { useChatDisplayInfo } from "./chat";

export function ChatContent() {
    const selectedChatId = useChatStore(s => s.selectedChatId);
    const chat = useChatStore(s =>
        s.chats.find(c => c.id === s.selectedChatId)
    );

    const otherUserId = (chat?.type === "PRIVATE") ? chat.otherUserId : null;

    const otherUser = useUserStore(s => otherUserId ? s.registry[otherUserId] : null);

    const { user } = useAuth();
    const [messageInput, setMessage] = useState("");
    const messages = useChatStore((state) => state.messages);
    const sendMessage = useChatStore((state) => state.sendMessage);

    const { title, avatarProps } = useChatDisplayInfo(chat);

    if (!chat || !selectedChatId) {
        return (
            <div className="flex-1 flex items-center justify-center text-white/30">
                <p>Chat not found</p>
            </div>
        );
    }

    const renderStatus = () => {
        if (chat.type !== "PRIVATE" || !otherUser) return null;

        if (otherUser.online) {
            return (
                <span className="flex items-center gap-1 text-green-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    online
                </span>
            );
        }

        if (otherUser.lastSeenAt) {
            const timeAgo = formatDistanceToNow(new Date(otherUser.lastSeenAt), { addSuffix: true });
            return <span className="text-white/40">last seen {timeAgo}</span>;
        }

        return <span className="text-white/40">offline</span>;
    };
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

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "0px";

            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 480;

            if (messageInput.length === 0) {
                textarea.style.height = "44px";
            } else {
                const finalHeight = scrollHeight > 44 ? scrollHeight : 44;
                textarea.style.height = `${Math.min(finalHeight, maxHeight)}px`;
            }

            textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
        }
    }, [messageInput]);

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="h-16 px-6 flex items-center gap-4 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                <div className="w-10 h-10 flex-shrink-0">
                    <Avatar {...avatarProps} />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm text-white truncate">{title}</h2>
                    <div className="text-xs">
                        {renderStatus()}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} isMine={message.senderId == user?.id} />
                ))}
            </div>

            <div className="px-6 py-4 border-t border-white/10 bg-black">
                <div className="flex items-end gap-3">
                    <button className="pb-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/60 hover:text-white">
                        <Smile className="w-5 h-5" />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={messageInput}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-4 rounded-2xl bg-white/5 border border-white/10 
               focus:border-white/20 focus:bg-white/10 outline-none 
               transition-[border,background] placeholder:text-white/40 text-white 
               resize-none overflow-y-auto leading-normal"
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            minHeight: "44px",
                            maxHeight: "480px",
                            boxSizing: "border-box",
                            lineHeight: "22px"
                        }}
                    />

                    <button
                        onClick={handleSend}
                        disabled={!messageInput.trim()}
                        className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 
                     hover:from-orange-600 hover:to-orange-700 transition-all 
                     shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 
                     disabled:hover:to-orange-600 "
                    >
                        <SendHorizonal className="w-5 h-5" />
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
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-white ${isMine
                    ? "bg-orange-500/20 rounded-br-sm border border-white/10"
                    : "bg-white/10 rounded-bl-sm border border-white/10"
                    }`}
            >
                <div className="flex items-end justify-between gap-2">
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap break-all">
                        {message.content}
                    </p>

                    <span
                        className={`text-[10px] whitespace-nowrap flex-shrink-0 ${isMine ? "text-white/70" : "text-white/40"
                            }`}
                    >
                        {formatTime(new Date(message.createdAt))}
                    </span>
                </div>
            </div>
        </div>
    );
}
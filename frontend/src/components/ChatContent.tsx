import { useState, useEffect, useRef } from "react";
import { Send, Smile } from "lucide-react";
import Avatar from "./Avatar";
import { useUser } from "../contexts/UserContext";
import { useChats } from "../contexts/ChatContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatContentProps {
    chatId: string;
}

interface Message {
    id: string;
    text: string;
    isMine: boolean;
    timestamp: Date;
}

export function ChatContent({ chatId }: ChatContentProps) {
    const [message, setMessage] = useState("");
    const { chats } = useChats();
    const chat = chats.find(c => c.id === chatId);
    const stompClient = useRef<Client | null>(null);

    // 1. WebSocket Connection Logic
    useEffect(() => {
        const client = new Client({
            brokerURL: `ws://${window.location.host}/ws`, // Nginx will proxy this
            webSocketFactory: () => new SockJS("/ws"),
            debug: (str) => console.log("STOMP:", str), // Fallback for SockJS
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe("/user/queue/events", (message) => {
                    const event = JSON.parse(message.body);
                    console.log("RECEIVED WS EVENT:", event);
                });
            },
            onDisconnect: () => console.log("Disconnected"),
            onStompError: (frame) => console.error("STOMP error", frame)
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    // 2. HTTP POST Logic
    const handleSend = async () => {
        if (!message.trim()) return;

        try {
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: chatId,
                    content: message.trim(),
                    replyToId: ""
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Message sent successfully:", data);
                setMessage("");
            } else {
                console.error("Failed to send message:", await response.text());
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    if (!chat) {
        return (
            <div className="flex-1 flex items-center justify-center text-white/30">
                <p>Chat not found</p>
            </div>
        );
    }

    const targetUserId = chat.type === 'PRIVATE' ? chat.otherUserId : undefined;
    const user = useUser(targetUserId);

    // Mock messages for display
    const [messages] = useState<Message[]>([
        {
            id: "1",
            text: "Hey! How are you doing?",
            isMine: false,
            timestamp: new Date(Date.now() - 3600000),
        },
        {
            id: "2",
            text: "I'm doing great! Just working on this new messenger app 🚀",
            isMine: true,
            timestamp: new Date(Date.now() - 3000000),
        },
        {
            id: "3",
            text: "That sounds exciting! What features are you implementing?",
            isMine: false,
            timestamp: new Date(Date.now() - 2400000),
        },
        {
            id: "4",
            text: "Real-time messaging, group chats, and end-to-end encryption. The design is inspired by Apple's minimalism with an orange-black theme.",
            isMine: true,
            timestamp: new Date(Date.now() - 1800000),
        },
    ]);

    let displayTitle = chat.title;
    let displayAvatar = chat.imageUrl;
    let displayColor = undefined;
    let isOnline = false;

    if (chat.type === 'PRIVATE' && user) {
        displayTitle = user.displayName;
        displayAvatar = user.avatarUrl;
        displayColor = user.color;
        isOnline = true; // Mock online status
    }


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Top Bar */}
            <div className="h-16 px-6 flex items-center gap-4 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                <div className="w-10 h-10 flex-shrink-0">
                    <Avatar
                        avatarUrl={displayAvatar}
                        displayName={displayTitle}
                        color={displayColor}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-white truncate">{displayTitle}</h2>
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
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
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
                            value={message}
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
                        disabled={!message.trim()}
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

interface MessageBubbleProps {
    message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[70%] rounded-3xl px-4 py-2.5 ${message.isMine
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-lg"
                    : "bg-white/10 text-white rounded-bl-lg border border-white/10"
                    }`}
            >
                <p className="text-sm leading-relaxed break-words">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                    <span
                        className={`text-[10px] ${message.isMine ? "text-white/70" : "text-white/40"
                            }`}
                    >
                        {formatTime(message.timestamp)}
                    </span>
                </div>
            </div>
        </div>
    );
}
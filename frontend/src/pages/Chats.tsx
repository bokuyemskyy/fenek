import { useState, useEffect } from "react";
import { Menu, Search, Settings, PenSquare, Loader2 } from "lucide-react";
import { ChatItem } from "../components/Chat";
import Fenek from "../assets/fenek.svg";
import "../styles/chats.css";
import OverlayRoot from "../overlay/OverlayRoot";
import { useOverlay } from "../overlay/OverlayContext";
import type { Chat } from "../types/chat";

const getInitials = (name: string) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
};



export default function Chats() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeChat, setActiveChat] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const { overlay, close, switchOverlay, openNewChat } = useOverlay();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(`/api/chats/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    const formattedChats = data.map((chat: Chat) => ({
                        id: chat.id,
                        title: chat.title,
                        description: chat.description,
                        lastMessage: chat.lastMessage || "No messages yet",
                        timestamp: chat.timestamp,
                        avatarUrl: chat.avatarUrl,
                        type: chat.type,
                        createdat: chat.createdAt
                    }));

                    setChats(formattedChats);
                } else {
                    console.error("Failed to fetch chats");
                }
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChats();
    }, []);

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Left Sidebar */}
            <div className={`flex flex-col border-r overflow-x-hidden border-white/10 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-80'}`}>
                {/* Header */}
                <div className="h-16 px-4 flex items-center gap-3 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                    <button
                        className="p-2 ml-1.5 mr-1.5 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div
                        className={`flex items-center gap-2 transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}
                    >
                        <img src={Fenek} alt="Fenek Logo" className="h-6" />
                        <span className="text-lg font-medium">fenek</span>
                    </div>

                    {!isSidebarCollapsed && (
                        <div className="ml-auto flex items-center gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    openNewChat(e.currentTarget.getBoundingClientRect());
                                }}
                            >
                                <PenSquare className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40 text-white/40">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : (
                        filteredChats.map(chat => (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                isActive={activeChat === chat.id}
                                onClick={() => setActiveChat(chat.id)}
                            />
                        ))
                    )}
                </div>

                {!isSidebarCollapsed && (<div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/40"
                        />
                    </div>
                </div>)}
            </div>

            <div className="flex-1 flex items-center justify-center bg-black">
                <div className="text-center">
                    <h2 className="text-xl font-medium text-white/60">Select a chat to start messaging</h2>
                </div>
            </div>

            <OverlayRoot
                overlay={overlay}
                onClose={close}
                onAction={switchOverlay}
            />
        </div>
    );
}
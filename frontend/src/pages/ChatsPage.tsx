import { useState, useEffect, useMemo } from "react";
import { Menu, Search, Settings, PenSquare, Loader2 } from "lucide-react";
import { ChatItem } from "../components/ChatItem";
import Fenek from "../assets/fenek.svg";
import { RootOverlayRenderer } from "../overlays/RootOverlay";
import { useOverlay } from "../contexts/OverlayContext";
import { useUser, useUsers } from "../contexts/UserContext";
import { useChats } from "../contexts/ChatContext";
import { ChatContent } from "../components/ChatContent";

export default function ChatsPage() {
    const {
        chats,
        isLoading,
        activeChatId,
        setActiveChatId,
        reloadChats
    } = useChats();
    const { registry, requestUsers } = useUsers();

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (chats.length === 0) return;
        const userIds = chats
            .filter(c => c.type === 'PRIVATE' && c.otherUserId)
            .map(c => c.otherUserId as string);
        requestUsers(userIds);
    }, [chats, requestUsers]);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const { open } = useOverlay();

    const filteredChats = useMemo(() => {
        return chats.filter(chat => {
            if (chat.type === 'PRIVATE') {
                const user = registry[chat.otherUserId || ""];

                if (!user) return false;

                return user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username?.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return chat.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [chats, searchQuery, registry]);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Left Sidebar */}
            <div
                className={`flex flex-col border-r border-white/10 transition-all duration-300 ease-in-out
                ${isSidebarCollapsed ? 'w-20' : 'w-80'}`}
            >
                {/* Header */}
                <div className="h-16 px-4 flex items-center gap-3 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">

                    <button
                        className="p-2 ml-1.5 mr-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-white"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className={`flex items-center gap-2 transition-opacity duration-200 overflow-hidden
                        ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                        <img src={Fenek} alt="Fenek Logo" className="h-6" />
                        <span className="text-lg font-medium tracking-tight">fenek</span>
                    </div>


                    <div className="ml-auto flex items-center gap-1">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-white"
                            onClick={() => open("menu")}>
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-white"
                            onClick={(e) => open("createChat", undefined, e.currentTarget)}
                        >
                            <PenSquare className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-white/40">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            {!isSidebarCollapsed && <span className="text-sm">Loading chats...</span>}
                        </div>
                    ) : (
                        filteredChats.map(chat => (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                isActive={activeChatId === chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                            />
                        ))
                    )}
                </div>

                {/* Search Footer */}
                {!isSidebarCollapsed && (
                    <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-orange-500/80 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                         focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all 
                                         placeholder:text-white/40 text-sm text-white"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-black relative">
                {activeChatId ? (
                    <ChatContent chatId={activeChatId} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-4">
                        <h2 className="text-lg font-medium">Select a chat to start messaging</h2>
                    </div>
                )}
            </div>

            <RootOverlayRenderer />
        </div>
    );
}
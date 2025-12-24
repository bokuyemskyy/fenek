import { useState } from "react";
import { Menu, Search, Settings, PenSquare } from "lucide-react";
import { ChatItem } from "../components/Chat"
import Fenek from "../assets/fenek.svg";
import "../styles/chats.css";
import type { Overlay } from "../overlay/Overlay";
import OverlayRoot from "../overlay/OverlayRoot";
import { useOverlay } from "../overlay/OverlayContext";

const mockChats = [
    {
        id: 1,
        name: "Alice Johnson",
        avatar: "AJ",
        lastMessage: "Hey! Are we still meeting tomorrow?",
        unread: true,
        timestamp: "2m ago"
    },
    {
        id: 2,
        name: "Design Team",
        avatar: "DT",
        lastMessage: "Sarah shared a new mockup",
        unread: true,
        timestamp: "15m ago"
    },
    {
        id: 3,
        name: "Bob Smith",
        avatar: "BS",
        lastMessage: "Thanks for the help!",
        unread: false,
        timestamp: "1h ago"
    },
    {
        id: 4,
        name: "Project Alpha",
        avatar: "PA",
        lastMessage: "Meeting notes uploaded",
        unread: false,
        timestamp: "3h ago"
    },
    {
        id: 5,
        name: "Emma Wilson",
        avatar: "EW",
        lastMessage: "Can you review the document?",
        unread: true,
        timestamp: "5h ago"
    },
    {
        id: 6,
        name: "Marketing Team",
        avatar: "MT",
        lastMessage: "Campaign launch scheduled",
        unread: false,
        timestamp: "Yesterday"
    },
    {
        id: 7,
        name: "David Lee",
        avatar: "DL",
        lastMessage: "Perfect, see you then!",
        unread: false,
        timestamp: "Yesterday"
    },
    {
        id: 8,
        name: "Coffee Chat ☕",
        avatar: "CC",
        lastMessage: "Who's in for 3pm?",
        unread: false,
        timestamp: "2d ago"
    }
];
export default function Chats() {
    const [activeChat, setActiveChat] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const { overlay, close, switchOverlay, openNewChat } = useOverlay();


    const filteredChats = mockChats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
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
                    {filteredChats.map(chat => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={activeChat === chat.id}
                            onClick={() => setActiveChat(chat.id)}
                        />
                    ))}
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
                onAction={switchOverlay} // <--- This enables the redirect
            />
        </div>
    );
}
import { useState } from "react";
import { Menu, Search, Settings, PenSquare } from "lucide-react";
import Fenek from "../assets/fenek.svg";

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
interface Chat {
}
interface ChatItemProps {
    chat: Chat,
    isActive: boolean,
    onClick: () => void
}
function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 cursor-pointer transition-colors border-b border-white/5 ${isActive
                ? "bg-orange-500/10"
                : "hover:bg-white/5"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                        <span className="text-xs text-white/40 flex-shrink-0 ml-2">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className={`text-sm truncate flex-1 ${chat.unread ? "text-white/90" : "text-white/40"
                            }`}>
                            {chat.lastMessage}
                        </p>
                        {chat.unread && (
                            <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Chats() {
    const [activeChat, setActiveChat] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredChats = mockChats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Left Sidebar */}
            <div className="w-80 flex flex-col border-r border-white/10">
                {/* Header */}
                <div className="h-16 px-4 flex items-center gap-3 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={Fenek} alt="Fenek Logo" className="h-6" />
                        <span className="text-lg font-medium">fenek</span>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.map(chat => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={activeChat === chat.id}
                            onClick={() => setActiveChat(chat.id)}
                        />
                    ))}
                </div>

                {/* Search Bar */}
                <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
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
                </div>
            </div>

            {/* Right Side - Chat Area (Placeholder) */}
            <div className="flex-1 flex items-center justify-center bg-black">
                <div className="text-center">
                    <h2 className="text-xl font-medium text-white/60">Select a chat to start messaging</h2>
                </div>
            </div>
        </div>
    );
}


// import React, { useEffect, useState } from "react";
// import { useAuth } from "../auth/AuthContext";

// export default function Chats() {
//     const { user, logout } = useAuth();

//     if (!user) return <p>Loading user info...</p>

//     return (
//         <div className="p-4">
//             <h1>Welcome, {user.displayName || user.email}!</h1>
//             <p>ID: {user.id}</p>
//             <p>Email: {user.email}</p>

//             <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
//                 Logout
//             </button>

//             <div className="mt-8">
//                 <h2>Chat area</h2>
//                 <p>Here would go your messages...</p>
//             </div>
//         </div>
//     )
// }

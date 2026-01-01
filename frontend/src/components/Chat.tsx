import type { Chat } from "../types/chat";
import Avatar from "./Avatar";
import { Bookmark } from "lucide-react";

interface ChatItemProps {
    chat: Chat,
    isActive: boolean,
    onClick: () => void
}
export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 cursor-pointer transition-colors border-b border-white/5 ${isActive
                ? "bg-orange-500/10"
                : "hover:bg-white/5"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12">
                    <Avatar avatarUrl={chat.avatarUrl} displayName={chat.title} icon={chat.type === "SAVED" ? <Bookmark className="w-5 h-5" /> : null} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                        <span className="text-xs text-white/40 flex-shrink-0 ml-2">{chat.timestamp?.toString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className={`text-sm truncate flex-1 ${false ? "text-white/90" : "text-white/40"
                            }`}>
                            {chat.lastMessage}
                        </p>
                        {false && (
                            <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

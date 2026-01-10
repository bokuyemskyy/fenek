import { Bookmark } from "lucide-react";
import type { ChatUI } from "../types/chat";
import Avatar from "./Avatar";
import { formatTimeAgo } from "../utils/date";
import { useUser } from "../context/UserContext";

interface ChatItemProps {
    chat: ChatUI;
    isActive: boolean;
    onClick: () => void;
}

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
    const targetUserId = chat.type === 'PRIVATE' ? chat.otherUserId : undefined;

    const user = useUser(targetUserId);

    let displayTitle = chat.title;
    let displayAvatar = chat.imageUrl;
    let displayColor = undefined;

    if (chat.type === 'PRIVATE') {
        if (user) {
            displayTitle = user.displayName;
            displayAvatar = user.avatarUrl;
            displayColor = user.color;
        } else {
            displayTitle = "Loading...";
        }
    }

    const renderAvatar = () => {
        if (chat.type === "SAVED") {
            return (
                <div className="w-full h-full rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <Bookmark className="w-5 h-5" />
                </div>
            );
        }

        return (
            <Avatar
                avatarUrl={displayAvatar}
                displayName={displayTitle}
                color={displayColor}
            />
        );
    };

    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 cursor-pointer transition-colors border-b border-white/5 
        ${isActive ? "bg-orange-500/10 border-l-2 border-l-orange-500" : "hover:bg-white/5 border-l-2 border-l-transparent"}`}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0">
                    {renderAvatar()}
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                        <h3 className={`font-medium text-sm truncate pr-2 ${!user && chat.type === 'PRIVATE' ? 'text-white/30 animate-pulse' : 'text-white'}`}>
                            {displayTitle}
                        </h3>
                        <span className="text-[11px] text-white/40 flex-shrink-0">
                            {formatTimeAgo(chat.timestamp)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-white/50 truncate flex-1">
                            {chat.lastMessage}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
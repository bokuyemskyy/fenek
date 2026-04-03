import Avatar from "@components/Avatar";
import { formatTimeAgo } from "./date";
import { useChatDisplayInfo, type Chat } from "./chat";


interface ChatItemProps {
    chat: Chat;
    isActive: boolean;
    onClick: () => void;
}
export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
    const { title, avatarProps } = useChatDisplayInfo(chat);

    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 cursor-pointer transition-colors border-b border-white/5 
                ${isActive ? "bg-orange-500/10 border-l-2 border-l-orange-500" : "hover:bg-white/5 border-l-2 border-l-transparent"}`}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0">
                    <Avatar {...avatarProps} />
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-sm truncate pr-2 text-white">
                            {title}
                        </h3>
                        <span className="text-[11px] text-white/40 flex-shrink-0">
                            {formatTimeAgo(chat.lastMessageTimestamp)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-white/50 truncate flex-1">
                            {chat.lastMessageSnippet}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
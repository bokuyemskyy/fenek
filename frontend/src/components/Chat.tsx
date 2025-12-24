import Avatar from "./Avatar";

interface Chat {
    id: string,
    title: string,
    type: string,
    lastMessage: string,
}
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
                    <Avatar displayName={chat.name} />
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

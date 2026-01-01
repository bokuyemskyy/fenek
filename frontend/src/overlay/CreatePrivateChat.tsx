import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, User, Check } from "lucide-react";
import type { CommonPopupProps } from "../types/overlay";
import Avatar from "../components/Avatar";

interface UserResult {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    color: string;
}

export default function CreatePrivateChat({ onClose }: CommonPopupProps) {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserResult[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const searchUsers = async () => {
            if (query.trim().length === 0) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`,
                    {
                        method: "GET",
                        credentials: "include",
                        signal: controller.signal
                    });

                if (!res.ok) {
                    throw new Error
                }

                const data = await res.json();
                setResults(data);

            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300);

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        }
    }, [query]);

    const handleCreateChat = async () => {
        if (!selectedUser) return;
        setIsCreating(true);

        try {
            const res = await fetch(`/api/chats/private`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ otherUserId: selectedUser.id })
                });

            onClose();
        } catch (error) {
            console.error("Failed to create chat", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="w-md bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto">

            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">New Chat</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="px-6 py-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-2xl 
                                   text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-orange-500/50 
                                   focus:border-orange-500/50 transition-all sm:text-sm"
                        placeholder="Search by username..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-[300px]">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/40 gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <span className="text-sm">Searching...</span>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-1">
                        {results.map((user) => {
                            const isSelected = selectedUser?.id === user.id;
                            return (
                                <button
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border
                                        ${isSelected
                                            ? "bg-orange-500/10 border-orange-500/50"
                                            : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full">
                                            <Avatar avatarUrl={user.avatarUrl} displayName={user.displayName} color={user.color} />
                                        </div>
                                        {isSelected && (
                                            <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5 border-2 border-black">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 text-left overflow-hidden">
                                        <div className={`text-base font-medium truncate ${isSelected ? "text-orange-500" : "text-white"}`}>
                                            {user.displayName}
                                        </div>
                                        <div className="text-sm text-white/40 truncate">
                                            @{user.username}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3">
                        {query ? (
                            <>
                                <Search className="w-12 h-12 stroke-1" />
                                <span className="text-sm">No users found</span>
                            </>
                        ) : (
                            <>
                                <User className="w-12 h-12 stroke-1" />
                                <span className="text-sm">Type to find people</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-white/5 bg-[#0c0c0c]">
                <button
                    disabled={!selectedUser || isCreating}
                    onClick={handleCreateChat}
                    className="px-6 py-3 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-orange-600 
                               text-white font-medium shadow-lg shadow-orange-500/20 
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                               hover:shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 
                               transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isCreating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Create chat"
                    )}
                </button>
            </div>
        </div>
    );
}
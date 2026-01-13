import { User, Users } from "lucide-react";
import { useOverlay } from "../contexts/OverlayContext";

export interface CreateChatProps {
    anchorRect: DOMRect;
}

export default function CreateChatOverlay() {
    const { open } = useOverlay();

    return (
        <div
            className="w-56 bg-[#1a1a1a] border border-white/10 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 animate-in zoom-in-95 duration-100"
        >
            <button
                onClick={() => open("createPrivateChat")}
                className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg text-sm text-white flex items-center gap-3 transition-colors"
            >
                <User className="w-4 h-4 text-white/70" />
                Direct Message
            </button>

            <button
                onClick={() => open("createGroup")}
                className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg text-sm text-white flex items-center gap-3 transition-colors"
            >
                <Users className="w-4 h-4 text-white/70" />
                Group Chat
            </button>
        </div>
    );
}
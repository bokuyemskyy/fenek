import { User, Users } from "lucide-react";
import { useOverlay } from "@features/overlay/OverlayContext";
import type { ReactNode } from "react";
import { SmallButton } from "@components/SmallButton";

export interface CreateChatProps {
    anchorRect: DOMRect;
}

interface OverlayButtonProps {
    onClick: () => void;
    icon: ReactNode;
    children: ReactNode;
}

export function OverlayButton({ onClick, icon, children }: OverlayButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg text-sm text-white flex items-center gap-3 transition-colors"
        >
            <span className="text-white/70 w-4 h-4 flex items-center justify-center">
                {icon}
            </span>
            {children}
        </button>
    );
}

export default function CreateChatOverlay() {
    const { open } = useOverlay();

    return (
        <div className="w-56 bg-black border border-white/10 p-1.5 flex flex-col gap-1 rounded-2xl shadow-2xl">
            <SmallButton
                label="Direct Message"
                icon={<User size={16} />}
                onClick={() => open("createPrivateChat")}
            />

            <SmallButton
                label="Group Chat"
                icon={<Users size={16} />}
                onClick={() => open("createGroup")}
            />
        </div>
    );
}
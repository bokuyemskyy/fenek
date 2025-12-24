import { useEffect, useRef } from "react";
import type { OverlayState, OverlayType } from "./Overlay";

// Components
import NewChat from "./NewChat";
import CreatePrivateChat from "./CreatePrivateChat";
// import CreateGroupChat from "./CreateGroupChat"; 

interface OverlayRootProps {
    overlay: OverlayState;
    onClose: () => void;
    onAction: (type: OverlayType) => void;
}

export default function OverlayRoot({ overlay, onClose, onAction }: OverlayRootProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!overlay) return;

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        if (overlay.type === "newChat") {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [overlay, onClose]);

    if (!overlay) return null;

    const isModal = ["settings", "createPrivateChat", "createGroup"].includes(overlay.type);

    return (
        <div className="relative z-50">
            {isModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            <div
                ref={containerRef}
                className={isModal ? "fixed inset-0 flex items-center justify-center pointer-events-none" : ""}
            >
                {overlay.type === "createPrivateChat" && (
                    <div className="pointer-events-auto">
                        <CreatePrivateChat onClose={onClose} onAction={onAction} />
                    </div>
                )}

                {/* overlay.type === "createGroup" && <CreateGroupChat ... /> */}

                {overlay.type === "newChat" && (
                    <NewChat
                        anchorRect={overlay.anchorRect}
                        onClose={onClose}
                        onAction={onAction}
                    />
                )}
            </div>
        </div>
    );
}
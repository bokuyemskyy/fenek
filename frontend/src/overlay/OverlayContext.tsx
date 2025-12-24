import { useState } from "react";
import type { OverlayState, OverlayType } from "./Overlay";

export function useOverlay() {
    const [overlay, setOverlay] = useState<OverlayState>(null);

    const open = (type: OverlayType, rect?: DOMRect) => {
        if (type === "newChat" && rect) {
            setOverlay({ type, anchorRect: rect });
        } else if (type !== "newChat") {
            setOverlay({ type });
        }
    };

    return {
        overlay,
        close: () => setOverlay(null),
        switchOverlay: (type: OverlayType) => open(type),

        openNewChat: (rect: DOMRect) => open("newChat", rect),
        openSettings: () => open("settings"),
        openNewPrivateChat: () => open("createPrivateChat"),
    };
}
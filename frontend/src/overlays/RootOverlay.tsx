import { useEffect } from "react";
import { OVERLAY_COMPONENTS } from "../types/overlay";
import { useOverlay } from "../contexts/OverlayContext";

export function RootOverlayRenderer() {
    const { overlay, close } = useOverlay();

    if (!overlay) return null;

    const Component = OVERLAY_COMPONENTS[overlay.type];
    const isPopup = !!overlay.anchor;

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [close]);

    if (!isPopup) {
        return (
            <div className="relative z-50">
                {/* Dark Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={close}
                />
                {/* Centered Content */}
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                    <div className="pointer-events-auto">
                        <Component {...overlay.props} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-50">
            {/* Transparent Backdrop for 'Click Outside' */}
            <div className="fixed inset-0" onClick={close} />

            {/* Positioned Content */}
            <PopupPositioner anchor={overlay.anchor!} >
                <Component {...overlay.props} />
            </PopupPositioner>
        </div>
    );
}

function PopupPositioner({ anchor, children }: { anchor: HTMLElement, children: React.ReactNode }) {
    const rect = anchor.getBoundingClientRect();

    const style: React.CSSProperties = {
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        zIndex: 51,
    };

    return (
        <div style={style} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    );
}
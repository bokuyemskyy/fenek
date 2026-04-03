import { useEffect } from "react";
import { OVERLAY_COMPONENTS } from "./overlay";
import { useOverlay } from "./OverlayContext";
export function RootOverlay() {
    const { overlay, close } = useOverlay();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [close]);

    if (!overlay) return null;

    const Component = OVERLAY_COMPONENTS[overlay.type];
    const isPopup = !!overlay.anchor;

    if (!isPopup) {
        return (
            <div className="fixed inset-0 z-50">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0"
                    onClick={close}
                />
                <div className="relative w-full h-full pointer-events-none">
                    <div className="pointer-events-auto w-full h-full">
                        <Component {...overlay.props} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-50">
            <div className="fixed inset-0" onClick={close} />
            <PopupPositioner anchor={overlay.anchor!}>
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
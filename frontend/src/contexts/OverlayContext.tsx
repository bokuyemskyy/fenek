import { createContext, useContext, useState, type ReactNode } from "react";
import type { OverlayType } from "../types/overlay";

type OverlayState = {
    type: OverlayType;
    props?: any;
    anchor?: HTMLElement | null;
} | null;

type OverlayContextValue = {
    overlay: OverlayState;
    open: (type: OverlayType, props?: any, anchor?: HTMLElement | null) => void;
    close: () => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
    const [overlay, setOverlay] = useState<OverlayState>(null);

    const close = () => setOverlay(null);

    const open = (type: OverlayType, props?: any, anchor?: HTMLElement | null) => {
        setOverlay({ type, props, anchor });
    };

    return (
        <OverlayContext.Provider value={{ overlay, open, close }}>
            {children}
        </OverlayContext.Provider>
    );
}

export const useOverlay = () => {
    const ctx = useContext(OverlayContext);
    if (!ctx) throw new Error("useOverlay must be used within OverlayProvider");
    return ctx;
};
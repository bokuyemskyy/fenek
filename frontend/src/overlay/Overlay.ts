export type OverlayType =
    | "settings"
    | "createPrivateChat"
    | "createGroup"
    | "newChat";

export type OverlayState =
    | { type: "settings" }
    | { type: "createPrivateChat" }
    | { type: "createGroup" }
    | { type: "newChat"; anchorRect: DOMRect }
    | null;

export interface CommonPopupProps {
    onClose: () => void;
    onAction: (nextType: OverlayType) => void;
}

export interface NewChatProps extends CommonPopupProps {
    anchorRect: DOMRect;
}
import CreateChatOverlay from "../overlays/CreateChatOverlay";
import CreatePrivateChatOverlay from "../overlays/CreatePrivateChatOverlay";
import { MenuOverlay } from "../overlays/MenuOverlay";

export const OVERLAY_COMPONENTS = {
    createChat: CreateChatOverlay,
    menu: MenuOverlay,
    createPrivateChat: CreatePrivateChatOverlay,
    createGroup: CreatePrivateChatOverlay
};

export type OverlayType = keyof typeof OVERLAY_COMPONENTS;
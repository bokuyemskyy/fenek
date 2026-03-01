import CreateChatOverlay from "@features/overlay/CreateChatOverlay";
import CreatePrivateChatOverlay from "@features/overlay/CreatePrivateChatOverlay";
import { MenuOverlay } from "@features/overlay/MenuOverlay";

export const OVERLAY_COMPONENTS = {
    createChat: CreateChatOverlay,
    menu: MenuOverlay,
    createPrivateChat: CreatePrivateChatOverlay,
    createGroup: CreatePrivateChatOverlay
};

export type OverlayType = keyof typeof OVERLAY_COMPONENTS;
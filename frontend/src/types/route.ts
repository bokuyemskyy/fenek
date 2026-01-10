export const RouteAccess = {
    Public: "public",
    GuestOnly: "guestOnly",
    AuthOnly: "authOnly",
    CompleteProfile: "completeProfile",
    IncompleteProfile: "incompleteProfile",
} as const;

export type RouteAccess =
    typeof RouteAccess[keyof typeof RouteAccess];
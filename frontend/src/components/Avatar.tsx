interface AvatarProps {
    avatarUrl?: string | null;
    displayName?: string;
    color?: string | null;
    icon?: React.ReactNode;
}
const getInitials = (displayName?: string) => {
    if (!displayName?.trim()) return "?";
    const names = displayName.trim().split(" ");
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export default function Avatar({
    avatarUrl,
    displayName,
    color,
    icon,
}: AvatarProps) {
    const initials = getInitials(displayName);
    const bgColor = color ?? "#f97316";

    return (
        <div className="w-full h-full aspect-square rounded-full overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={displayName ? `${displayName}'s avatar` : "Avatar"}
                    className="w-full h-full object-cover"
                />
            ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill={bgColor} />
                    <foreignObject width="100" height="100">
                        <div className="w-full h-full flex items-center justify-center text-white">
                            {icon ? (
                                <div className="w-1/2 h-1/2">{icon}</div>
                            ) : (
                                <span className="text-3xl font-medium">{initials}</span>
                            )}
                        </div>
                    </foreignObject>
                </svg>
            )}
        </div>
    );
}
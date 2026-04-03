interface SmallButtonProps {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "select" | "action" | "important";
    isActive?: boolean;
    disabled?: boolean;
}

export function SmallButton({
    label, icon, onClick, variant = "select", isActive, disabled
}: SmallButtonProps) {
    const styles = {
        base: "flex items-center transition-all border group disabled:cursor-not-allowed",
        variants: {
            select: "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white",
            action: "bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20 hover:border-orange-500/40",
            important: "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500/30",
        },
        active: {
            select: "bg-white/15 border-white/40 text-white shadow-lg shadow-white/5",
            action: "bg-orange-500/20 border-orange-500/60 text-orange-400",
            important: "bg-red-500/20 border-red-500/60 text-red-400",
        },
        disabled: "bg-white/5 border-white/10 text-white/40",
    };

    const currentStyle = disabled ? styles.disabled : (isActive ? styles.active[variant] : styles.variants[variant]);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${styles.base} w-full justify-start gap-3 px-3 py-2 rounded-xl text-sm ${currentStyle}`}
        >
            {icon && (
                <span className={`shrink-0 w-4 h-4 flex items-center justify-center transition-colors ${isActive ? "text-white" : "text-inherit"}`}>
                    {icon}
                </span>
            )}
            <span className="font-medium truncate">{label}</span>
        </button>
    );
}
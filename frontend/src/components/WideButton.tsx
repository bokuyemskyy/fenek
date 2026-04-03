import React from "react";

type WideButtonVariant = "select" | "action" | "important";

interface WideButtonProps {
    label: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick?: () => void;
    variant?: WideButtonVariant;
    disabled?: boolean;
    isActive?: boolean; // New Flag
    showNotAvailable?: boolean;
}

export function WideButton({
    label,
    leftIcon,
    rightIcon,
    onClick,
    variant = "select",
    disabled = false,
    isActive = false,
    showNotAvailable = false,
}: WideButtonProps) {
    const base =
        "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all border group";

    const styles = {
        select:
            "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white",
        action:
            "bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20 hover:border-orange-500/40",
        important:
            "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500/30",
    };

    const activeStyles = {
        select: "bg-white/15 border-white/40 text-white shadow-lg shadow-white/5",
        action: "bg-orange-500/20 border-orange-500/60 text-orange-400",
        important: "bg-red-500/20 border-red-500/60 text-red-400",
    };

    const disabledStyles =
        "bg-white/5 border-white/10 text-white/40 cursor-not-allowed";

    const currentStyle = disabled
        ? disabledStyles
        : (isActive ? activeStyles[variant] : styles[variant]);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${currentStyle}`}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                {leftIcon && (
                    <div className={`shrink-0 flex items-center justify-center transition-colors ${isActive ? "text-white" : "text-inherit"}`}>
                        {leftIcon}
                    </div>
                )}
                <span className="font-medium text-left truncate">{label}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {showNotAvailable && disabled && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-red-400/80">
                        Not available
                    </span>
                )}

                {rightIcon && (
                    <div className={`
                        transition-all duration-200
                        ${disabled
                            ? "opacity-0"
                            : (isActive
                                ? "opacity-100 translate-x-0" // Always visible if active
                                : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1"
                            )
                        }
                    `}>
                        {rightIcon}
                    </div>
                )}
            </div>
        </button >
    );
}
import React from "react";

interface WideSettingProps {
    label: string;
    value: string;
    onClick?: () => void;
    disabled?: boolean;
    showNotAvailable?: boolean;
}

export function WideSetting({
    label,
    value,
    onClick,
    disabled = false,
    showNotAvailable = false,
}: WideSettingProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl 
                       transition-all border
                       ${disabled
                    ? "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                }`}
        >
            <span className="font-medium">{label}</span>

            <div className="flex items-center gap-2">
                <span className="text-sm text-white/50">{value}</span>

                {showNotAvailable && disabled && (
                    <span className="text-xs text-red-400">Not available</span>
                )}
            </div>
        </button>
    );
}
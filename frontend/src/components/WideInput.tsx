import React from "react";

interface WideInputProps {
    label: string,
    value: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function WideInput({
    label,
    value,
    placeholder,
    onChange,
    disabled = false,
}: WideInputProps) {
    return (
        <div>
            <label className="block text-sm text-white/60 mb-2">{label}</label>

            <input
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl 
                       bg-white/5 border border-white/10 
                       text-white placeholder-white/40
                       focus:outline-none focus:ring-2 focus:ring-white/20
                       transition-all"
            />
        </div>
    );
}
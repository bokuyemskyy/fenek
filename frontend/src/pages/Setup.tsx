import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Fenek from "../assets/fenek.svg";
import { useAuth } from "../auth/AuthContext";

export default function Setup() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const [displayName, setDisplayName] = useState(user.displayName);
    const [username, setUsername] = useState(user.email.split("@")[0]);
    const email = user.email;

    const [avatarColor, setAvatarColor] = useState(user.color || "#f97316");
    const [showColorPicker, setShowColorPicker] = useState(false);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const colorOptions = [
        "#f97316",
        "#d946ef",
        "#22c55e",
        "#3b82f6",
        "#eab308",
        "#ef4444",
    ];

    const handleSubmit = async () => {
        if (!user) return;

        const formData = new FormData();
        formData.append("username", username);
        formData.append("displayName", displayName);
        formData.append("color", avatarColor);
        if (avatarFile) formData.append("avatar", avatarFile);

        try {
            const response = await fetch("/api/users/me", {
                method: "PATCH",
                body: formData,
                credentials: "include"
            });

            if (!response.ok) {
                const err = await response.text();
                console.error("Failed to update profile:", err);
                return;
            }

            user.isComplete = true;
            navigate("/chats");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    const handleColorSelect = (color: string) => {
        setAvatarColor(color);
        setShowColorPicker(false);
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    }
    const handleAvatarRemoval = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    }
    const getInitials = () => {
        if (!displayName.trim()) return "?";
        const names = displayName.trim().split(" ");
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={Fenek} alt="Fenek Logo" className="h-8" />
                        <span className="text-xl font-medium">fenek</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Title */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-medium mb-3">Profile setup</h1>
                        <p className="text-white/60">Complete your profile to get started</p>
                    </div>


                    <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="pb-6">
                                        <label htmlFor="username" className="block text-sm mb-2 text-white/80">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                            placeholder="Choose a username"
                                        />
                                    </td>
                                    <td rowSpan={2} className="w-px whitespace-nowrap pl-8 align-middle">
                                        <div className="relative group">
                                            <div
                                                className="h-48 aspect-square rounded-full flex items-center justify-center text-6xl font-medium cursor-pointer overflow-hidden relative transition-colors duration-300"
                                                style={{ backgroundColor: avatarPreview ? "#00000000" : avatarColor }}
                                                onClick={() => document.getElementById("avatarInput")?.click()}
                                            >
                                                {avatarPreview ? (
                                                    <img
                                                        src={avatarPreview}
                                                        alt="avatar preview"
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <span className="relative z-10">{getInitials()}</span>
                                                )}

                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20 gap-2">
                                                    <span className="text-sm text-white">click to upload</span>
                                                    {avatarPreview && (
                                                        <button
                                                            type="button" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAvatarRemoval();
                                                            }}
                                                            className="text-xs text-red-400 hover:text-red-500 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
                                                        >
                                                            remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                id="avatarInput"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarUpload}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pb-6">
                                        <label htmlFor="realName" className="block text-sm mb-2 text-white/80">
                                            Real name
                                        </label>
                                        <input
                                            type="text"
                                            id="realName"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                            placeholder="Your real name"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pb-6">
                                        <label htmlFor="email" className="block text-sm mb-2 text-white/80">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                                        />
                                    </td><td className="pl-8 text-center relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowColorPicker(!showColorPicker)}
                                            className="w-full px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-medium flex items-center gap-3 justify-center whitespace-nowrap"
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full border border-white/20"
                                                style={{ backgroundColor: avatarColor }}
                                            ></span>
                                            <span>Pick a color</span>
                                        </button>

                                        {showColorPicker && (
                                            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 bg-black/80 p-4 rounded-2xl border border-white/10 flex gap-2 z-50 shadow-xl backdrop-blur-md">
                                                {colorOptions.map((color, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleColorSelect(color)}
                                                        className="w-10 h-10 rounded-full cursor-pointer border border-white/10 hover:scale-110 transition-transform relative overflow-hidden"
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all  shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-3 ml-auto mr-auto"
                        >
                            <span>Start chatting</span>
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 text-center">
                        <Link to="/" className="text-sm text-white/60 hover:text-white/80 transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </div >
            </main >
        </div >
    );
}

import { useState } from "react";
import { useAuth } from "@features/auth/AuthContext";
import { X, ArrowLeft, User, Settings, Globe, LogOut, Brush, ArrowRight } from "lucide-react";
import Avatar from "@components/Avatar";
import { useOverlay } from "./OverlayContext";
import { WideButton } from "@components/WideButton";
import { WideSetting } from "@components/WideSetting";
import { WideInput } from "@components/WideInput";

type MenuSection = "main" | "profile" | "settings" | "language";

export function MenuOverlay() {
    const { close } = useOverlay();
    const [currentSection, setCurrentSection] = useState<MenuSection>("main");
    const { user, loading, logout } = useAuth();

    if (loading) {
        return <div className="text-white p-6">Loading...</div>;
    }

    if (!user) {
        return <div className="text-white p-6">Not logged in</div>;
    }

    const handleBack = () => {
        setCurrentSection("main");
    };

    const handleClose = () => {
        setCurrentSection("main");
        close();
    };

    const renderContent = () => {
        switch (currentSection) {
            case "profile":
                return <ProfileSection />;
            case "settings":
                return <SettingsSection />;
            case "language":
                return <LanguageSection />;
            default:
                return (
                    <>
                        <div className="flex flex-col min-h-full">
                            <div className="flex flex-col items-center gap-3 pb-6 border-b border-white/10">
                                <div className="w-20 h-20">
                                    <Avatar
                                        avatarUrl={user.avatarUrl}
                                        displayName={user.displayName}
                                        color={user.color}
                                    />
                                </div>
                                <div className="text-center">
                                    <h2 className="font-medium text-white text-lg">
                                        {user.displayName}
                                    </h2>
                                    <p className="text-sm text-white/50">{user.email}</p>
                                </div>
                            </div>

                            <div className="py-4 space-y-2">
                                <WideButton
                                    leftIcon={<User className="w-5 h-5" />}
                                    label="My Profile"
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                    onClick={() => setCurrentSection("profile")}
                                />
                                <WideButton
                                    leftIcon={<Settings className="w-5 h-5" />}
                                    label="General Settings"
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                    onClick={() => setCurrentSection("settings")}
                                />
                                <WideButton
                                    leftIcon={<Globe className="w-5 h-5" />}
                                    label="Language"
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                    onClick={() => setCurrentSection("language")}
                                />
                            </div>

                            <div className="mt-auto pt-4">
                                <WideButton
                                    leftIcon={<LogOut className="w-5 h-5" />}
                                    label="Log Out"
                                    variant="important"
                                    onClick={logout}>
                                </WideButton>

                            </div>
                        </div >
                    </>
                );
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div
                className="w-full max-w-xl bg-black border border-white/10 rounded-3xl 
                shadow-2xl shadow-black/50 overflow-hidden flex flex-col
                h-[700px] max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-white/10">    {currentSection !== "main" ? (
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="w-9" />
                )}

                    <h3 className="text-lg font-medium text-white">
                        {currentSection === "main" && "Menu"}
                        {currentSection === "profile" && "My Profile"}
                        {currentSection === "settings" && "General Settings"}
                        {currentSection === "language" && "Language"}
                    </h3>

                    <button
                        onClick={handleClose}
                        className="p-2 -mr-2 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto flex flex-col min-h-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}



function ProfileSection() {
    const { user } = useAuth();
    if (!user) return null;

    const [displayName, setDisplayName] = useState(user.displayName);
    const [username, setUsername] = useState(user.username || user.email.split("@")[0]);
    const [avatarColor, setAvatarColor] = useState(user.color || "#f97316");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorOptions = ["#f97316", "#d946ef", "#22c55e", "#3b82f6", "#eab308", "#ef4444"];

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("displayName", displayName);
        formData.append("color", avatarColor);
        if (avatarFile) formData.append("avatarFile", avatarFile);

        try {
            const response = await fetch("/api/users/me", {
                method: "PATCH",
                body: formData,
                credentials: "include"
            });
            if (response.ok) {
                console.log("Profile updated!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-full space-y-6">
            <div className="flex items-center gap-6 pb-2">
                <div className="relative group w-24 h-24 shrink-0">
                    <Avatar avatarUrl={avatarPreview} color={avatarColor} displayName={displayName} />
                    <button
                        onClick={() => document.getElementById("profileAvatarInput")?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-[10px] uppercase font-bold tracking-tighter"
                    >
                        Change
                    </button>
                    <input type="file" id="profileAvatarInput" hidden accept="image/*" onChange={handleAvatarUpload} />
                </div>

                <div className="flex-1 space-y-2">
                    <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Profile Color</label>
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                onClick={() => setAvatarColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${avatarColor === color ? "border-white" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <WideInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <WideInput
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <WideInput
                    label="Email"
                    value={user.email}
                    disabled
                />
            </div>

            {/* Action Button at the bottom */}
            <div className="mt-auto pt-6">
                <WideButton
                    variant="action"
                    leftIcon={<Brush className="w-5 h-5" />}
                    label="Save Changes"
                    onClick={handleSave}
                />
            </div>
        </div>
    );
}

function SettingsSection() {
    return (
        <div className="space-y-3">
            <WideSetting label="Notifications" value="Enabled" />
            <WideSetting label="Sound" value="On" />
            <WideSetting label="Theme" value="Dark" />
            <WideSetting label="Auto-download media" value="Wi-Fi only" />
            <WideSetting label="Chat backup" value="Daily" />

            <div className="pt-4">
                <p className="text-xs text-white/40 text-center">
                    Settings are read-only in this demo
                </p>
            </div>
        </div>
    );
}

function LanguageSection() {
    const languages = [
        { code: "en", name: "English", isActive: true, isAvailable: true },
        { code: "ru", name: "Russian", isActive: false, isAvailable: false },
    ];

    return (
        <div className="space-y-2">
            {languages.map((lang) => (
                <WideButton
                    key={lang.code}
                    label={lang.name}
                    isActive={lang.isActive}
                    disabled={!lang.isAvailable}
                    showNotAvailable={!lang.isAvailable}
                    onClick={() => { }}
                />
            ))}
        </div>
    );
}
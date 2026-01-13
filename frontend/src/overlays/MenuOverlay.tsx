import { useState } from "react";
import { X, ArrowLeft, User, Settings, Globe, LogOut } from "lucide-react";
import Avatar from "../components/Avatar";
import { useOverlay } from "../contexts/OverlayContext";

type MenuSection = "main" | "profile" | "settings" | "language";

export function MenuOverlay() {
    const { close } = useOverlay();
    const [currentSection, setCurrentSection] = useState<MenuSection>("main");

    const currentUser = {
        displayName: "John Doe",
        email: "john.doe@example.com",
        avatarUrl: undefined,
        color: "#ff6b35",
    };

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
                return <ProfileSection onBack={handleBack} />;
            case "settings":
                return <SettingsSection onBack={handleBack} />;
            case "language":
                return <LanguageSection onBack={handleBack} />;
            default:
                return (
                    <>
                        {/* Header with User Info */}
                        <div className="flex flex-col items-center gap-3 pb-6 border-b border-white/10">
                            <div className="w-20 h-20">
                                <Avatar
                                    avatarUrl={currentUser.avatarUrl}
                                    displayName={currentUser.displayName}
                                    color={currentUser.color}
                                />
                            </div>
                            <div className="text-center">
                                <h2 className="font-medium text-white text-lg">
                                    {currentUser.displayName}
                                </h2>
                                <p className="text-sm text-white/50">{currentUser.email}</p>
                            </div>
                        </div>

                        {/* Menu Buttons */}
                        <div className="py-4 space-y-2">
                            <MenuButton
                                icon={<User className="w-5 h-5" />}
                                label="My Profile"
                                onClick={() => setCurrentSection("profile")}
                            />
                            <MenuButton
                                icon={<Settings className="w-5 h-5" />}
                                label="General Settings"
                                onClick={() => setCurrentSection("settings")}
                            />
                            <MenuButton
                                icon={<Globe className="w-5 h-5" />}
                                label="Language"
                                onClick={() => setCurrentSection("language")}
                            />
                        </div>

                        {/* Logout Button */}
                        <div className="pt-4 border-t border-white/10">
                            <button
                                onClick={() => console.log("Logout clicked")}
                                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl 
                         bg-red-500/10 hover:bg-red-500/20 transition-all
                         border border-red-500/20 hover:border-red-500/30 group"
                            >
                                <LogOut className="w-5 h-5 text-red-500" />
                                <span className="font-medium text-red-500">Log out</span>
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div
            className="w-full max-w-md mx-4 bg-black border border-white/10 rounded-3xl 
                   shadow-2xl shadow-black/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                {currentSection !== "main" ? (
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="w-9" /> // Spacer
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

            {/* Content */}
            <div className="p-6 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                {renderContent()}
            </div>
        </div>
    );
}

interface MenuButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

function MenuButton({ icon, label, onClick }: MenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl 
               bg-white/5 hover:bg-white/10 transition-all
               border border-white/10 hover:border-orange-500/30 group"
        >
            <div className="text-white/70 group-hover:text-orange-500 transition-colors">
                {icon}
            </div>
            <span className="font-medium text-white text-left flex-1">{label}</span>
            <div className="text-white/30 group-hover:text-white/50 transition-colors">
                <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
        </button>
    );
}

// Profile Section Component
function ProfileSection({ onBack }: { onBack: () => void }) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-white/60 mb-2">Username</label>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                        johndoe
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-white/60 mb-2">Display Name</label>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                        John Doe
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-white/60 mb-2">Email</label>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40">
                        john.doe@example.com
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-white/60 mb-2">Bio</label>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 min-h-[80px]">
                        No bio set
                    </div>
                </div>
            </div>

            <button
                className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 
                 hover:from-orange-600 hover:to-orange-700 transition-all 
                 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30
                 font-medium text-white"
            >
                Edit Profile
            </button>
        </div>
    );
}

// Settings Section Component
function SettingsSection({ onBack }: { onBack: () => void }) {
    return (
        <div className="space-y-3">
            <SettingItem label="Notifications" value="Enabled" />
            <SettingItem label="Sound" value="On" />
            <SettingItem label="Theme" value="Dark" />
            <SettingItem label="Auto-download media" value="Wi-Fi only" />
            <SettingItem label="Chat backup" value="Daily" />

            <div className="pt-4">
                <p className="text-xs text-white/40 text-center">
                    Settings are read-only in this demo
                </p>
            </div>
        </div>
    );
}

// Language Section Component
function LanguageSection({ onBack }: { onBack: () => void }) {
    const languages = [
        { code: "en", name: "English", isActive: true },
        { code: "es", name: "Español", isActive: false },
        { code: "fr", name: "Français", isActive: false },
        { code: "de", name: "Deutsch", isActive: false },
        { code: "it", name: "Italiano", isActive: false },
        { code: "pt", name: "Português", isActive: false },
    ];

    return (
        <div className="space-y-2">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl 
                   transition-all border ${lang.isActive
                            ? "bg-orange-500/10 border-orange-500/30 text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                        }`}
                >
                    <span className="font-medium">{lang.name}</span>
                    {lang.isActive && (
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    )}
                </button>
            ))}
        </div>
    );
}

// Setting Item Component
interface SettingItemProps {
    label: string;
    value: string;
}

function SettingItem({ label, value }: SettingItemProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-white font-medium">{label}</span>
            <span className="text-white/50 text-sm">{value}</span>
        </div>
    );
}

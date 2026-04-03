import { useNavigate } from "react-router-dom";
import { Zap, Users, UserRound, Brush, KeyRound, Binary, File } from "lucide-react";
import Fenek from "@assets/fenek.svg";
import SocialLink from "@components/SocialLink";
import FeatureCard from "@components/FeatureCard";
import { useAuth } from "@features/auth/AuthContext";

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={Fenek} alt="Fenek Logo" className="h-8" />
                        <span className="text-xl font-medium">fenek</span>
                    </div>
                    <button
                        onClick={() => { isAuthenticated ? navigate("/chats") : navigate("/login") }}
                        className="px-4 py-2 rounded-full border border-orange-500/30 hover:bg-orange-500/10 transition-colors"
                    >
                        {isAuthenticated ? "To chats" : "Log in"}
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-32 pb-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Main Heading */}
                    <div className="text-center mb-16">
                        <h1 className="text-6xl font-medium mb-6 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                            fenek
                        </h1>
                        <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
                            A simple messenger.
                            Connect with your world.
                        </p>
                        <button
                            onClick={() => { isAuthenticated ? navigate("/chats") : navigate("/login") }}
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30"
                        >
                            {isAuthenticated ? "Continue to messenger" : "Get started"}
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-16">
                        <h2 className="text-lg text-white/60 mb-6">Available now</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FeatureCard
                                icon={<Zap className="w-6 h-6" />}
                                title="Lightning Fast"
                                description="Instant messaging with optimized performance and real-time delivery."
                            />
                            <FeatureCard
                                icon={<UserRound className="w-6 h-6" />}
                                title="Private Chats"
                                description="Find your friends, see when they are online or typing, and chat with them in a private space."
                            />
                            <FeatureCard
                                icon={<Brush className="w-6 h-6" />}
                                title="Custom Profiles"
                                description="Personalize your profile by changing your name, avatar, and chat color."
                            />
                            <FeatureCard
                                icon={<KeyRound className="w-6 h-6" />}
                                title="Secure Authentication"
                                description="Sign in with Google or GitHub and stay logged in with long-lasting sessions."
                            />
                        </div>
                    </div>

                    {/* Future Features */}
                    <div className="mb-16 group opacity-70 hover:opacity-100 transition-opacity duration-300">
                        <h2 className="text-lg text-white/60 mb-6">Planned features</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={<Binary className="w-6 h-6" />}
                                title="Encryption"
                                description="End-to-end encryption to keep your conversations fully protected."
                            />
                            <FeatureCard
                                icon={<Users className="w-6 h-6" />}
                                title="Group Chats"
                                description="Create groups and channels to connect with more people."
                            />
                            <FeatureCard
                                icon={<File className="w-6 h-6" />}
                                title="Media Sharing"
                                description="Share photos, videos, and files seamlessly in your chats."
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="text-center">
                        <h3 className="text-lg text-white/60 mb-6">
                            Connect with me
                        </h3>
                        <div className="flex justify-center gap-6">
                            <SocialLink href="https://github.com/bokuyemskyy/fenek" label="GitHub" />
                            <SocialLink href="https://www.linkedin.com/in/bokuyemskyy/" label="LinkedIn" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 px-6">
                <div className="container mx-auto text-center text-white/40 text-sm">
                    <p>fenek {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
};
import { useNavigate } from "react-router-dom";
import { MessageSquare, Zap, Shield, Globe, MessageCircle, Users } from "lucide-react";
import Fenek from "../assets/fenek.svg";
import SocialLink from "../components/SocialLink";
import FeatureCard from "../components/FeatureCard";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
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
                        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                            A simple messenger.
                            Connect with your world seamlessly.
                        </p>
                        <button
                            onClick={() => { isAuthenticated ? navigate("/chats") : navigate("/login") }}
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30"
                        >
                            {isAuthenticated ? "Continue to messenger" : "Get started"}
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-15">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Lightning Fast"
                            description="Experience instant messaging with optimized performance and real-time delivery."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Secure & Private"
                            description="End-to-end encryption ensures your conversations stay private and protected."
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6" />}
                            title="Group Chats"
                            description="Create unlimited groups and channels to connect with communities of any size."
                        />
                        <FeatureCard
                            icon={<MessageCircle className="w-6 h-6" />}
                            title="Rich Media"
                            description="Share photos, videos, documents, and more with seamless file handling."
                        />
                    </div>

                    {/* Social Links */}
                    <div className="text-center">
                        <h3 className="text-sm uppercase tracking-wider text-white/40 mb-6">
                            Connect with us
                        </h3>
                        <div className="flex justify-center gap-6">
                            <SocialLink href="https://twitter.com" label="Twitter" />
                            <SocialLink href="https://github.com" label="GitHub" />
                            <SocialLink href="https://linkedin.com" label="LinkedIn" />
                            <SocialLink href="https://instagram.com" label="Instagram" />
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
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Zap, Shield, Globe } from "lucide-react";
import FenekLogo from '../assets/fenek.svg';

const Welcome = () => {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();

    const features = [
        {
            icon: MessageSquare,
            title: "Clear chats",
            description: "A minimal UI designed for focus. Keep conversations sharp."
        },
        {
            icon: Shield,
            title: "End-to-End Security",
            description: "You are safe. Conversations are secured with a powerful encryption."
        },
        {
            icon: Zap,
            title: "Blazing Fast",
            description: "Built for performance. Send and receive messages instantly, no lag."
        },
    ];

    const socials = [
        { name: "GitHub", url: "https://github.com/your-project" },
        { name: "Twitter", url: "https://twitter.com/your-handle" },
        { name: "LinkedIn", url: "https://linkedin.com/in/your-profile" },
    ];

    const ActionButton = () => (
        <button
            onClick={() => keycloak.authenticated ? navigate("/chats") : keycloak.login()}
            className="px-8 py-3 bg-orange-500 text-black text-xl font-bold rounded-xl hover:bg-orange-400 transition transform hover:scale-[1.02]"
        >
            {keycloak.authenticated ? "Enter Messenger" : "Get Started"}
        </button>
    );

    const NavButton = () => (
        <button
            onClick={() => keycloak.authenticated ? navigate("/chats") : keycloak.login()}
            className="px-6 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-400 transition"
        >
            {keycloak.authenticated ? "Go to Chats" : "Sign In"}
        </button>
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-gray-200 flex flex-col items-center">

            <header className="w-full max-w-7xl px-6 md:px-12 py-6 flex justify-end">
                <NavButton />
            </header>

            <main className="flex-grow w-full max-w-7xl px-6 md:px-12 py-10">

                <div className="flex flex-col lg:flex-row justify-between items-start">

                    <div className="flex items-start w-full lg:w-3/4">

                        <div className="mr-10 mt-2">
                            <img
                                src={FenekLogo}
                                alt="Fenek Messenger Logo"
                                className="w-32 h-32 md:w-48 md:h-48 object-contain"
                            />
                        </div>

                        <div className="flex flex-col pt-4 max-w-lg w-full">

                            <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 tracking-tight mb-2">fenek</h1>

                            <h2 className="text-xl md:text-2xl font-semibold mb-8 text-gray-200 leading-relaxed">
                                Next-level messaging
                            </h2>

                            <ActionButton />

                        </div>
                    </div>


                </div>

                <div className="mt-20 border-t border-neutral-800 pt-10">
                    <h3 className="text-2xl font-bold mb-8 text-center text-orange-500">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="p-6 bg-neutral-900 rounded-xl shadow-lg hover:shadow-orange-500/10 transition duration-300">
                                <div className="flex items-start mb-2">
                                    <feature.icon size={20} className="text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                                    <h4 className="text-base sm:text-lg font-semibold leading-tight">{feature.title}</h4>
                                </div>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-20 border-t border-neutral-800 pt-10">
                    <h3 className="text-2xl font-bold mb-8 text-center text-orange-500">Connect with the Project</h3>
                    <ul className="flex justify-center space-x-6">
                        {socials.map((social) => (
                            <li key={social.name}>
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-orange-500 transition"
                                >
                                    {social.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>

            <footer className="w-full bg-neutral-950 border-t border-neutral-800 px-6 md:px-12 py-4 flex justify-end">
                <p className="text-gray-600 text-sm">
                    © {new Date().getFullYear()} Fenek. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Welcome;
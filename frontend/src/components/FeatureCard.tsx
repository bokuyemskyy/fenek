interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="group relative p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-orange-500/30 transition-all">
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{title}</h3>
                    <p className="text-white/60 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
}
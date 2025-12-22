interface SocialLinkProps {
    href: string;
    label: string;
}

export default function SocialLink({ href, label }: SocialLinkProps) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border=white/10 hover:border-orange-500/30 hover:bg-white/5 transition-all text-sm">
            {label}
        </a>
    );
}
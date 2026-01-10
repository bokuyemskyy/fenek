import { Loader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center gap-8 animate-in fade-in duration-700 fill-mode-forwards">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-150" />


                </div>

                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                    <span className="text-white text-sm font-medium tracking-widest animate-pulse">
                        Loading...
                    </span>
                </div>
            </div>
        </div>
    );
}
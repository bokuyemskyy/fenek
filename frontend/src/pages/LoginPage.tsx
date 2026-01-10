import { Link, useLocation } from "react-router-dom";
import { siGithub, siGoogle } from 'simple-icons';
import Fenek from "../assets/fenek.svg";

function GoogleIcon() {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: siGoogle.svg }}
        />
    );
}
function GithubIcon() {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: siGithub.svg }}
        />
    );
}

export default function LoginPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hasError = queryParams.has("error");
    const error = queryParams.get("error");

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "email_exists":
                return "This email is already registered with another provider. Please use the original sign-in method.";
            default:
                return "Login failed. Please try again.";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <img src={Fenek} alt="Fenek Logo" className="h-8" />
                        <span className="text-2xl font-large">fenek</span>
                    </div>
                    <h1 className="text-3xl font-medium mb-2">Welcome back</h1>
                    <p className="text-white/60">Log in to continue to your account</p>
                </div>

                {hasError && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-red-600/30 border border-red-600/80 text-white text-center">
                        {getErrorMessage(error)}
                    </div>
                )}

                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="space-y-4">
                        <a
                            href="/oauth2/authorization/github"
                            className="w-full px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3"
                        >
                            <GithubIcon />
                            <span>Continue with GitHub</span>
                        </a>

                        <a
                            href="/oauth2/authorization/google"
                            className="w-full px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3"
                        >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </a>
                    </div>

                    {/* <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#0c0c0c] text-white/40">or</span>
                        </div>
                    </div>
 <div className="text-center text-sm text-white/60">
                        Or log in as{" "}
                        <a
                            href="/api/auth/test-user"
                            className="text-orange-500 hover:text-orange-400 transition-colors"
                        >
                            test user
                        </a>
                    </div> */}
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-sm text-white/60 hover:text-white/80 transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
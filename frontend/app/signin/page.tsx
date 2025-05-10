"use client"

import { usePrivy, useLogin } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import Splash from "@/components/widgets/splash";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignup } from "@/services/auth/mutation";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
    const { ready, authenticated } = usePrivy();
    const { mutateAsync: signup } = useSignup();
    const [loading, setLoading] = useState(false);
    const { login } = useLogin({
        onComplete: async () => {
            setLoading(true);
            try {
                const response = await signup();
                if (response.success) {
                    redirect("/");
                }
            } finally {
                setLoading(false);
            }
        }
    });
    if (!ready) return <Splash />;
    if (ready && authenticated) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg animate-fade-in">
                <div className="flex flex-col items-center gap-2">
                    <Image src="/images/logo2.0.png" alt="Levelin Logo" width={56} height={56} className="mb-2" priority />
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">Welcome</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to access your account</p>
                </div>
                <div className="mt-8 space-y-6">
                    <Button
                        onClick={() => login()}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        aria-label="Sign in with Privy"
                        disabled={loading}
                    >
                        {loading ? <Spinner size="small" className="mr-2" aria-label="Signing in" /> : null}
                        {loading ? "Signing in..." : "Continue with Privy"}
                    </Button>
                    <div className="text-center text-sm text-gray-500">
                        By signing in, you agree to our{' '}
                        <a href="/terms" className="underline hover:text-indigo-600 focus:text-indigo-700" tabIndex={0} aria-label="Terms of Service">Terms of Service</a> and{' '}
                        <a href="/privacy" className="underline hover:text-indigo-600 focus:text-indigo-700" tabIndex={0} aria-label="Privacy Policy">Privacy Policy</a>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
        </div>
    );
}
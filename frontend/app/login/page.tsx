"use client"

import { usePrivy, useLogin } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import Splash from "@/components/widgets/splash";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/services/auth/mutation";

export default function Login() {
    const { ready } = usePrivy();
    const { mutateAsync: signup } = useSignup();
    const { login } = useLogin({
        onComplete: async () => {
            console.log("signup");
            const response = await signup();
            console.log("signup success", response);
            if (response.success) {
                redirect("/");
            }
        }
    });
    if (!ready) return <Splash />;
    
    return (
        <div>
            <Button onClick={() => login()}>Login</Button>
        </div>
    );
}
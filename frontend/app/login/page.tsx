"use client"

import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import Splash from "@/components/widgets/splash";
import { Button } from "@/components/ui/button";

export default function Login() {
    const { ready, authenticated, login } = usePrivy();
    if (!ready) return <Splash />;
    if (authenticated) {
        redirect("/");
    }
    return (
        <div>
            <Button onClick={() => login()}>Login</Button>
        </div>
    );
}
"use client"

import { Button } from "@/components/ui/button";
import Splash from "@/components/widgets/splash";
import { useMe } from "@/services/auth/query";
import { usePrivy } from '@privy-io/react-auth'
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
    const { user, ready, authenticated, logout } = usePrivy()

    if (!ready) {
        return <Splash />
    }
    if (!authenticated) {
        redirect("/login")
    }

    const { data: me } = useMe(); 

    return (
      <div>
        {authenticated ? <h1>Hello {user?.email?.address}</h1> : <h1>Hello World</h1>}
        <Button onClick={() => logout()}>Logout</Button>
        <Button onClick={() => {
            toast.error("Hello world");
        }}>Test sonner</Button>
        <pre>{JSON.stringify(me, null, 2)}</pre>
      </div>
    );
}
"use client"

import { Button } from "@/components/ui/button";
import Splash from "@/components/widgets/splash";
import { useGetTest } from "@/services/test/query";
import { usePrivy } from '@privy-io/react-auth'
import { redirect } from "next/navigation";

export default function Home() {
    const { user, ready, authenticated, logout } = usePrivy()
    const { data: testData } = useGetTest();

    if (!ready) {
        return <Splash />
    }
    if (!authenticated) {
        redirect("/login")
    }

    return (
      <div>
        {authenticated ? <h1>Hello {user?.email?.address}</h1> : <h1>Hello World</h1>}
        <Button onClick={() => logout()}>Logout</Button>
        <h1>data: {testData?.message}</h1>
      </div>
    );
}
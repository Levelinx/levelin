"use client"

import { DockDemo } from "@/components/widgets/dock";
import { usePrivy } from '@privy-io/react-auth'

export default function Home() {
    const { user, ready, authenticated } = usePrivy()
    return (
      <div>
        {/* <h1>Hello World hu</h1> */}
        {/* <DockDemo /> */}
        {authenticated ? <h1>Hello {user?.email?.address}</h1> : <h1>Hello World</h1>}
      </div>
    );
  }
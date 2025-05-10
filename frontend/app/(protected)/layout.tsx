"use client";

import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import Splash from "@/components/widgets/splash";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return <Splash />;
  }
  if (ready && !authenticated) {
    redirect("/signin");
  }

  return <>{children}</>;
}

"use client";

import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import Splash from "@/components/widgets/splash";
import { useMe } from "@/services/auth/query";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const { data: me, isLoading } = useMe();

  if (!ready) {
    return <Splash />;
  }

  if (!isLoading && me?.data?.[0] && me.data[0].onboarding_completed === false) {
    console.log("Onboarding not completed", me);
    if (window.location.pathname !== "/onboarding") {
      redirect("/onboarding");
    }
  }

  if (ready && !authenticated) {
    redirect("/signin");
  }

  return <>{children}</>;
}

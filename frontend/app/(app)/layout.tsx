"use client";

import { Home, Search, PlusCircle, Trophy, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
    {
        name: "Home",
        href: "/",
        icon: Home,
    },
    {
        name: "Search",
        href: "/search",
        icon: Search,
    },
    {
        name: "New",
        href: "/new",
        icon: PlusCircle,
    },
    {
        name: "Leaderboard",
        href: "/leaderboard",
        icon: Trophy,
    },
    {
        name: "Profile",
        href: "/profile",
        icon: User,
    },
];

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 pb-16">{children}</main>
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
                <div className="flex h-16 items-center justify-around">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    "flex flex-1 flex-col items-center justify-center gap-1 p-2",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <tab.icon className="h-6 w-6" />
                                <span className="text-xs">{tab.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
} 
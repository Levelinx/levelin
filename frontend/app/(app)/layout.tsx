"use client";

import { Home, Search, PlusCircle, Trophy, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const [showTabBar, setShowTabBar] = useState(true);
    const [forceShow, setForceShow] = useState(true); // Always show for 3s on load/nav
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);
    const tabBarRef = useRef<HTMLDivElement>(null);
    const lastY = useRef<number | null>(null);
    const lastMoveTime = useRef<number>(0);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount and on resize
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Show tab bar for 3s on initial mount
    useEffect(() => {
        setShowTabBar(true);
        setForceShow(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setForceShow(false), 3000);
        return () => {
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
        };
    }, []);

    // Show/hide tab bar on desktop based on mouse position, with 3s delay to hide
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (isMobile) {
            setShowTabBar(true);
            return;
        }
        const handleMouseMove = (e: MouseEvent) => {
            if (isMobile) return setShowTabBar(true);
            const fromBottom = window.innerHeight - e.clientY;
            const now = Date.now();
            // Detect fast downward movement
            if (lastY.current !== null) {
                const dy = e.clientY - lastY.current;
                const dt = now - lastMoveTime.current;
                if (dy > 40 && dt < 80) {
                    setShowTabBar(true);
                    if (hideTimeout.current) clearTimeout(hideTimeout.current);
                    lastY.current = e.clientY;
                    lastMoveTime.current = now;
                    return;
                }
            }
            lastY.current = e.clientY;
            lastMoveTime.current = now;
            if (fromBottom < 80) {
                setShowTabBar(true);
                if (hideTimeout.current) clearTimeout(hideTimeout.current);
            } else if (!forceShow) {
                if (hideTimeout.current) clearTimeout(hideTimeout.current);
                hideTimeout.current = setTimeout(() => setShowTabBar(false), 3000);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [forceShow, isMobile]);

    // Animation variants for fast show and slow hide
    const variants = {
        hidden: {
            y: 100,
            opacity: 0,
            scale: 0.7,
            transition: { type: "spring", stiffness: 120, damping: 18, duration: 0.8 },
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 30, duration: 0.2 },
        },
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 w-full max-w-2xl mx-auto pb-24 px-2 sm:px-0">{children}</main>
            {/* Floating, curved, animated tab bar */}
            <AnimatePresence>
                {showTabBar && (
                    <motion.nav
                        ref={tabBarRef}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={variants}
                        className={
                            cn(
                                "fixed left-1/2 bottom-6 z-50 flex h-16 w-[95vw] max-w-md -translate-x-1/2 items-center justify-around rounded-full bg-background/90 shadow-2xl border border-border backdrop-blur-lg px-2 sm:px-4",
                                "transition-all duration-300"
                            )
                        }
                    >
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={cn(
                                        "flex flex-1 flex-col items-center justify-center gap-1 p-2 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <tab.icon className="h-6 w-6" />
                                    <span className="text-xs">{tab.name}</span>
                                </Link>
                            );
                        })}
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
} 
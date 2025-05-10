"use client"

import { Bell } from "lucide-react";
// import { useMe } from "@/services/auth/query";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { dummyPosts } from "@/lib/dummy-data";
import { Post, PostSkeleton } from "@/components/post";
import { useEffect, useState } from "react";

export default function Home() {
    // const { data: me } = useMe();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // if (!me?.data?.[0]) {
    //     return null;
    // }

    return (
        <div className="container max-w-2xl">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/logo2.0.png"
                            alt="Levelin"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="text-lg font-semibold">Levelin</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            3
                        </span>
                    </Button>
                </div>
            </header>

            {/* Feed */}
            <div className="divide-y">
                {isLoading ? (
                    // Show 3 skeleton posts while loading
                    Array.from({ length: 3 }).map((_, i) => (
                        <PostSkeleton key={i} />
                    ))
                ) : (
                    dummyPosts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))
                )}

                {/* Empty state */}
                {!isLoading && dummyPosts.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                        No posts yet. Be the first to post!
                    </div>
                )}
            </div>
        </div>
    );
}
"use client"

import { Bell } from "lucide-react";
import { useMe } from "@/services/auth/query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type Post = {
    id: string;
    user: {
        id: string;
        name: string;
        avatar_url: string;
    };
    content: string;
    created_at: string;
};

type PostsResponse = {
    posts: Post[];
    nextPage: number | null;
};

export default function Home() {
    const { data: me } = useMe();
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery<PostsResponse>({
        queryKey: ["posts"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await api.get<PostsResponse>("/api/posts", {
                params: { page: pageParam },
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (!me?.data?.[0]) {
        return null;
    }

    return (
        <div className="container max-w-2xl">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/logo.png"
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
                {status === "pending" ? (
                    // Loading skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Skeleton className="mt-4 h-20 w-full" />
                        </div>
                    ))
                ) : status === "error" ? (
                    <div className="p-4 text-center text-muted-foreground">
                        Something went wrong
                    </div>
                ) : (
                    data?.pages.map((page, i) => (
                        <div key={i}>
                            {page.posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={post.user.avatar_url}
                                            alt={post.user.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {post.user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    post.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 whitespace-pre-wrap">
                                        {post.content}
                                    </p>
                                </article>
                            ))}
                        </div>
                    ))
                )}

                <div
                    ref={ref}
                    className="h-10 w-full"
                >
                    {isFetchingNextPage && (
                        <div className="flex items-center justify-center p-4">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    )}
                </div>

                {/* No more posts */}
                {!hasNextPage && data?.pages[0]?.posts && data.pages[0].posts.length > 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                        No more posts
                    </div>
                )}

                {/* Empty state */}
                {!hasNextPage && (!data?.pages[0]?.posts || data.pages[0].posts.length === 0) && (
                    <div className="p-4 text-center text-muted-foreground">
                        No posts yet. Be the first to post!
                    </div>
                )}
            </div>
        </div>
    );
}
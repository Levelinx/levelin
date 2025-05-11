"use client"

import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Post, PostSkeleton } from "@/components/post";
import { useEffect, useState } from "react";
import { useMe } from "@/services/auth/query";
import { usePosts } from "@/services/posts/query";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

export default function Home() {
    const { } = useMe(); // Keep the query but don't destructure anything
    const { ref, inView } = useInView();
    const [unreadNotifications] = useState(3); // This would be dynamic in the future
    
    // Fetch posts with infinite scroll
    const { 
        data: postsData,
        isLoading: isLoadingInitialPosts,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error
    } = usePosts(10); // Fetch 10 posts per page
    
    // Load more posts when the load more sentinel comes into view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
    
    // Show error toast only once when there's an error
    useEffect(() => {
        if (isError && error) {
            toast.error("Failed to load posts. Please try again later.");
            console.error("Error loading posts:", error);
        }
    }, [isError, error]);

    // Combine all pages of posts into a single array
    const posts = postsData?.pages.flatMap(page => page.data) || [];
    const isEmpty = !isLoadingInitialPosts && posts.length === 0;

    return (
        <div className="container max-w-2xl">
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
                    <Link href="/notifications">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                        >
                          <Bell className="h-5 w-5" />
                          {unreadNotifications > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                {unreadNotifications}
                            </span>
                          )}
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="divide-y">
                {/* Show skeletons only during initial loading */}
                {isLoadingInitialPosts && (
                    Array.from({ length: 3 }).map((_, i) => (
                        <PostSkeleton key={`skeleton-${i}`} />
                    ))
                )}

                {/* Display actual posts */}
                {posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}

                {/* Empty state */}
                {isEmpty && (
                    <div className="p-8 text-center">
                        <p className="text-muted-foreground mb-4">No posts yet. Be the first to post!</p>
                        <Link href="/new/post">
                            <Button>Create Post</Button>
                        </Link>
                    </div>
                )}

                {/* Loading indicator for infinite scroll */}
                {!isEmpty && (
                    <div ref={ref} className="py-4">
                        {isFetchingNextPage && (
                            <div className="flex justify-center">
                                <PostSkeleton />
                            </div>
                        )}
                        {!hasNextPage && posts.length > 0 && (
                            <p className="text-center text-sm text-muted-foreground py-4">
                                No more posts to load
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
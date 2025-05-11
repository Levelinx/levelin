"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Post, PostSkeleton } from "@/components/post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePost } from "@/services/posts/query";
import { useReplyToPost, useToggleLike } from "@/services/posts/mutation";
import { toast } from "sonner";

export default function PostPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Fetch post and replies
    const { 
        data: postData, 
        isLoading, 
        isError, 
        error, 
        refetch
    } = usePost(postId);
    
    // Mutations
    const { mutate: replyToPost } = useReplyToPost();
    const { mutate: toggleLike } = useToggleLike();
    
    // Handle error
    useEffect(() => {
        if (isError && error) {
            toast.error("Failed to load post. Please try again.");
            console.error("Error loading post:", error);
        }
    }, [isError, error]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!comment.trim()) {
            toast.error("Please enter a comment");
            return;
        }
        
        setIsSubmitting(true);
        
        replyToPost(
            { 
                postId, 
                content: comment 
            },
            {
                onSuccess: () => {
                    setComment("");
                    refetch();
                },
                onSettled: () => {
                    setIsSubmitting(false);
                }
            }
        );
    };

    const handleLike = () => {
        toggleLike(postId, {
            onSuccess: () => {
                refetch();
            }
        });
    };

    // Error state
    if (isError || (!isLoading && !postData)) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <p className="text-muted-foreground mb-4">Could not load post. It might have been deleted or you don&apos;t have permission to view it.</p>
                <Button onClick={() => router.push('/')}>Return Home</Button>
            </div>
        );
    }
    
    // Get data safely
    const post = postData?.post;
    const replies = postData?.replies || [];
    const likeCount = post?.likes?.[0]?.count || 0;
    const commentsCount = replies.length;
    
    return (
        <div className="max-w-2xl mx-auto relative pb-32">
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
                <div className="flex items-center gap-4 p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="hover:bg-muted"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold">Post</h1>
                </div>
            </div>

            {/* Main Post - Show skeleton or actual post */}
            {isLoading || !post ? (
                <PostSkeleton />
            ) : (
                <Post post={post} showActions={false} />
            )}

            {/* Likes and comments count */}
            <div className="flex justify-between px-4 py-3 border-b">
                <div className="flex gap-6 text-muted-foreground">
                    {isLoading ? (
                        <>
                            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                            <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                        </>
                    ) : (
                        <>
                            <span><b>{commentsCount}</b> {commentsCount === 1 ? 'Comment' : 'Comments'}</span>
                            <span><b>{likeCount}</b> {likeCount === 1 ? 'Like' : 'Likes'}</span>
                        </>
                    )}
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLike}
                    disabled={isLoading}
                    className="text-muted-foreground hover:text-primary"
                >
                    Like
                </Button>
            </div>

            {/* Comments section */}
            <div>
                {isLoading ? (
                    // Show comment skeletons while loading
                    Array.from({ length: 3 }).map((_, i) => (
                        <PostSkeleton key={`comment-skeleton-${i}`} />
                    ))
                ) : replies.length === 0 ? (
                    // No comments state
                    <div className="p-8 text-center text-muted-foreground">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    // Actual comments
                    replies.map((reply) => (
                        <div key={reply.id} className="border-b">
                            <Post post={reply} showActions={false} />
                        </div>
                    ))
                )}
            </div>

            {/* Fixed comment input at the bottom */}
            <form onSubmit={handleSubmitComment} className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 max-w-2xl mx-auto p-4 flex flex-col gap-2">
                <Textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    disabled={isSubmitting || isLoading}
                />
                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!comment.trim() || isSubmitting || isLoading}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        "Post Comment"
                    )}
                </Button>
            </form>
        </div>
    );
} 
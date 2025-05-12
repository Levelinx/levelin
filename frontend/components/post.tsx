import { useRouter } from "next/navigation";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CommentModal } from "@/components/CommentModal";
import { useToggleLike } from "@/services/posts/mutation";

// Updated Post type to match API response
interface User {
    id: string;
    name: string;
    avatar_url: string | null;
}

export interface Post {
    id: string;
    content: string;
    created_at: string;
    user: User;
    user_id?: string;
    parent_id?: string | null;
    metadata?: Record<string, unknown>;
    updated_at?: string;
    likes?: { count: number }[];
    replies?: { count: number }[];
    is_liked_by_me?: boolean;
}

interface PostProps {
    post: Post;
    showActions?: boolean;
    inDetailPage?: boolean;
}

// Helper to check if a post is liked by the current user
const isPostLiked = (postId: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        return !!likedPosts[postId];
    } catch (error) {
        console.log('Error checking like status:', error);
        return false;
    }
};

// Helper to set post liked status
const setPostLiked = (postId: string, isLiked: boolean): void => {
    if (typeof window === 'undefined') return;
    
    try {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        if (isLiked) {
            likedPosts[postId] = true;
        } else {
            delete likedPosts[postId];
        }
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    } catch (error) {
        console.error('Error saving like status:', error);
    }
};

export function Post({ post, showActions = true, inDetailPage = false }: PostProps) {
    const router = useRouter();
    const [imgError, setImgError] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const { mutate: toggleLike } = useToggleLike();
    
    // Local state for optimistic UI updates
    const [optimisticLikeCount, setOptimisticLikeCount] = useState(
        post.likes && post.likes[0]?.count ? post.likes[0].count : 0
    );
    const [optimisticIsLiked, setOptimisticIsLiked] = useState(false);

    // Initialize like state from either server-provided value or localStorage on component mount
    useEffect(() => {
        // Prefer server-provided is_liked_by_me if available
        if (post.is_liked_by_me !== undefined) {
            setOptimisticIsLiked(post.is_liked_by_me);
        } else {
            // Fall back to localStorage if server doesn't provide the value
            setOptimisticIsLiked(isPostLiked(post.id));
        }
    }, [post.id, post.is_liked_by_me]);

    // Generate a fallback avatar if needed
    const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.user.name)}`;
    const avatarSrc = imgError || !post.user.avatar_url ? fallbackAvatar : post.user.avatar_url;

    const handlePostClick = () => {
        // Navigate to the post detail page
        router.push(`/post/${post.id}`);
    };

    const handleUserClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/profile/${post.user.id}`);
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (inDetailPage) return; // Don't open modal if already in detail page
        
        // In home page, open comment modal
        setIsCommentModalOpen(true);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Copy the URL to clipboard
        const url = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success("Post URL copied to clipboard");
            })
            .catch((err) => {
                console.error("Failed to copy URL: ", err);
                toast.error("Failed to copy URL");
            });
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Optimistic update
        const newLikedStatus = !optimisticIsLiked;
        setOptimisticIsLiked(newLikedStatus);
        setOptimisticLikeCount(newLikedStatus ? optimisticLikeCount + 1 : optimisticLikeCount - 1);
        
        // Update local storage
        setPostLiked(post.id, newLikedStatus);
        
        toggleLike(post.id, {
            onSuccess: () => {
                // API call succeeded, nothing to do as we already updated UI
            },
            onError: () => {
                // Revert optimistic update if API call fails
                setOptimisticIsLiked(!newLikedStatus);
                setOptimisticLikeCount(newLikedStatus ? optimisticLikeCount - 1 : optimisticLikeCount + 1);
                setPostLiked(post.id, !newLikedStatus);
                toast.error("Failed to update like status");
            }
        });
    };

    // Format the date nicely
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        
        // If it's today, show time
        const isToday = new Date().toDateString() === date.toDateString();
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Otherwise show date
        return date.toLocaleDateString();
    };
    
    // Get reply count
    const replyCount = post.replies && post.replies[0]?.count ? post.replies[0].count : 0;

    return (
        <>
            <article 
                className={`p-4 border-b hover:bg-muted/50 transition-colors ${!inDetailPage ? 'cursor-pointer' : ''}`} 
                onClick={!inDetailPage ? handlePostClick : undefined}
            >
                <div className="flex items-center gap-3">
                    <div onClick={handleUserClick} className="cursor-pointer relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                        <img
                            src={avatarSrc}
                            alt={post.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    </div>
                    <div onClick={handleUserClick} className="cursor-pointer">
                        <p className="font-medium hover:underline">
                            {post.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(post.created_at)}
                        </p>
                    </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap">
                    {post.content}
                </p>
                {showActions && (
                    <div className="flex items-center gap-6 mt-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={handleCommentClick}
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>{replyCount}</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`gap-2 ${optimisticIsLiked ? 'text-red-500' : ''}`}
                            onClick={handleLikeClick}
                        >
                            <Heart 
                                className="h-4 w-4" 
                                fill={optimisticIsLiked ? "currentColor" : "none"} 
                            />
                            <span>{optimisticLikeCount}</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={handleShareClick}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </article>

            {/* Comment Modal */}
            {isCommentModalOpen && (
                <CommentModal 
                    post={post}
                    isOpen={isCommentModalOpen}
                    onClose={() => setIsCommentModalOpen(false)}
                    onCommentAdded={() => {
                        // Refresh post data
                        router.refresh();
                    }}
                />
            )}
        </>
    );
}

export function PostSkeleton() {
    return (
        <div className="p-4 border-b">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
            <div className="mt-4 flex gap-4">
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </div>
        </div>
    );
} 
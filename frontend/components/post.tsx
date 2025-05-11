import { useRouter } from "next/navigation";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Updated Post type to match API response
interface User {
    id: string;
    name: string;
    avatar_url: string | null;
}

interface Post {
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
}

interface PostProps {
    post: Post;
    showActions?: boolean;
}

export function Post({ post, showActions = true }: PostProps) {
    const router = useRouter();
    const [imgError, setImgError] = useState(false);

    // Generate a fallback avatar if needed
    const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.user.name)}`;
    const avatarSrc = imgError || !post.user.avatar_url ? fallbackAvatar : post.user.avatar_url;

    const handlePostClick = () => {
        // Navigate to the post detail page
        // Check if it's a comment/reply (has parent_id) or a main post
        if (!post.parent_id) {
            router.push(`/post/${post.id}`);
        }
    };

    const handleUserClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/profile/${post.user.id}`);
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

    // Get like count
    const likeCount = post.likes && post.likes[0]?.count ? post.likes[0].count : 0;
    
    // Get reply count
    const replyCount = post.replies && post.replies[0]?.count ? post.replies[0].count : 0;

    return (
        <article 
            className={`p-4 border-b hover:bg-muted/50 transition-colors ${!post.parent_id ? 'cursor-pointer' : ''}`} 
            onClick={!post.parent_id ? handlePostClick : undefined}
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
                    <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{replyCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        <span>{likeCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </article>
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
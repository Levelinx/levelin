import { Post as PostType } from "@/lib/dummy-data";
import { useRouter } from "next/navigation";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PostProps {
    post: PostType;
    showActions?: boolean;
}

export function Post({ post, showActions = true }: PostProps) {
    const router = useRouter();

    const handlePostClick = () => {
        router.push(`/post/${post.id}`);
    };

    const handleUserClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/profile/${post.user.id}`);
    };

    return (
        <article className="p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer" onClick={handlePostClick}>
            <div className="flex items-center gap-3">
                <div onClick={handleUserClick} className="cursor-pointer">
                    <img
                        src={post.user.avatar_url}
                        alt={post.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                </div>
                <div onClick={handleUserClick} className="cursor-pointer">
                    <p className="font-medium hover:underline">
                        {post.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
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
                        <span>{post.comments?.length || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes || 0}</span>
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
        <div className="p-4">
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
        </div>
    );
} 
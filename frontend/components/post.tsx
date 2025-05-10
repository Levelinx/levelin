import { Post as PostType } from "@/lib/dummy-data";

interface PostProps {
    post: PostType;
}

export function Post({ post }: PostProps) {
    return (
        <article className="p-4">
            <div className="flex items-center gap-3">
                <img
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
                        {new Date(post.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap">
                {post.content}
            </p>
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
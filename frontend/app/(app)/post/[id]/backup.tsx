"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Post } from "@/components/post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Post as PostType, Comment } from "@/lib/dummy-data";

// This would normally come from an API
const dummyPost: PostType = {
    id: "1",
    content: "This is a sample post",
    created_at: new Date().toISOString(),
    user: {
        id: "1",
        name: "John Doe",
        avatar_url: "https://github.com/shadcn.png",
    },
    comments: [
        {
            id: "1",
            content: "This is a comment",
            created_at: new Date().toISOString(),
            user: {
                id: "2",
                name: "Jane Smith",
                avatar_url: "https://github.com/shadcn.png",
            },
            replies: [
                {
                    id: "2",
                    content: "This is a reply",
                    created_at: new Date().toISOString(),
                    user: {
                        id: "1",
                        name: "John Doe",
                        avatar_url: "https://github.com/shadcn.png",
                    },
                },
            ],
        },
    ],
};

export default function PostPage({ params }: { params: { id: string } }) {
    const { id } = params;
    console.log(id);
    const router = useRouter();
    const [comment, setComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);

    // Flatten comments and replies into a single array
    const flatComments = (dummyPost.comments || []).reduce<Comment[]>((acc, comment) => {
        acc.push(comment);
        if (comment.replies) {
            acc.push(...comment.replies);
        }
        return acc;
    }, []);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally submit the comment to your API
        console.log("Submitting comment:", comment, "Replying to:", replyTo);
        setComment("");
        setReplyTo(null);
    };

    const handleCommentClick = (id: string) => {
        router.push(`/post/${id}`);
    };

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

            <Post post={dummyPost} showActions={false} />

            {/* Likes and comments count */}
            <div className="flex gap-6 px-4 py-2 border-b text-muted-foreground">
                <span><b>{flatComments.length}</b> Comments</span>
                <span><b>{dummyPost.likes || 0}</b> Likes</span>
            </div>

            {/* Flat list of comments and replies as posts */}
            <div>
                {flatComments.map((item) => (
                    <div key={item.id} onClick={() => handleCommentClick(item.id)} className="cursor-pointer border-b hover:bg-muted/50 transition-colors">
                        <Post post={item} showActions={true} />
                    </div>
                ))}
            </div>

            {/* Fixed comment input at the bottom */}
            <form onSubmit={handleSubmitComment} className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 max-w-2xl mx-auto p-4 flex flex-col gap-2">
                {replyTo && (
                    <div className="text-xs text-muted-foreground mb-1">
                        Replying to comment ID: {replyTo}
                        <Button variant="link" size="sm" className="ml-2 p-0 h-auto text-xs" onClick={() => setReplyTo(null)}>
                            Cancel
                        </Button>
                    </div>
                )}
                <Textarea
                    placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                />
                <Button type="submit" className="w-full">
                    {replyTo ? "Reply" : "Comment"}
                </Button>
            </form>
        </div>
    );
} 
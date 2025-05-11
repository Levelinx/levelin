import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, replyToPost, toggleLike } from "./api";
import { toast } from "sonner";

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post created successfully");
        },
        onError: (error) => {
            toast.error("Failed to create post");
            console.error("Create post error:", error);
        },
    });
};

export const useReplyToPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content, metadata }: { postId: string; content: string; metadata?: any }) =>
            replyToPost(postId, { content, metadata }),
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Reply posted successfully");
        },
        onError: (error) => {
            toast.error("Failed to post reply");
            console.error("Reply to post error:", error);
        },
    });
};

export const useToggleLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleLike,
        onSuccess: (_, postId) => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            toast.error("Failed to toggle like");
            console.error("Toggle like error:", error);
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete post");
            console.error("Delete post error:", error);
        },
    });
}; 
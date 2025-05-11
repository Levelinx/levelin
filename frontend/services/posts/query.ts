import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPostById, getPosts, getUserPosts } from "./api";

export const usePosts = (limit?: number) => {
    return useInfiniteQuery({
        queryKey: ["posts", limit],
        queryFn: ({ pageParam }) => getPosts({ cursor: pageParam, limit }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length === 0) return undefined;
            return lastPage.data[lastPage.data.length - 1].created_at;
        },
    });
};

export const usePost = (id: string) => {
    return useQuery({
        queryKey: ["post", id],
        queryFn: () => getPostById(id),
        enabled: !!id,
    });
};

export const useUserPosts = (userId: string) => {
    return useQuery({
        queryKey: ["user-posts", userId],
        queryFn: () => getUserPosts(userId),
        enabled: !!userId,
    });
}; 
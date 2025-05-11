import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPostById, getPosts, getUserPosts } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const usePosts = (limit?: number) => {
    const token = usePrivyToken();
    
    return useInfiniteQuery({
        queryKey: ["posts", limit],
        queryFn: ({ pageParam }) => getPosts({ cursor: pageParam, limit }, token),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length === 0) return undefined;
            return lastPage.data[lastPage.data.length - 1].created_at;
        },
        enabled: !!token,
    });
};

export const usePost = (id: string) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["post", id],
        queryFn: () => getPostById(id, token),
        enabled: !!id && !!token,
    });
};

export const useUserPosts = (userId: string) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["user-posts", userId],
        queryFn: () => getUserPosts(userId, token),
        enabled: !!userId && !!token,
    });
}; 
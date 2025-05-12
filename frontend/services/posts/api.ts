import getApi from "@/utils/axios";

export interface User {
    id: string;
    name: string;
    avatar_url: string | null;
}

export interface Post {
    id: string;
    content: string;
    user_id: string;
    user: User;
    parent_id: string | null;
    metadata: any | null;
    created_at: string;
    updated_at: string;
    likes: { count: number }[];
    replies: { count: number }[];
    is_liked_by_me?: boolean;
}

export interface GetPostsResponse {
    data: Post[];
    count: number;
}

export interface GetPostResponse {
    post: Post;
    replies: Post[];
}

export interface CreatePostRequest {
    content: string;
    metadata?: any;
}

export interface CreatePostResponse {
    data: Post;
}

export interface ToggleLikeResponse {
    liked: boolean;
    data?: {
        id: string;
        post_id: string;
        user_id: string;
        created_at: string;
    };
}

export async function getPosts(
    params?: { cursor?: string; limit?: number },
    accessToken?: string
): Promise<GetPostsResponse> {
    const api = getApi(accessToken);
    const response = await api.get("/api/posts", { params });
    return response.data;
}

export async function getPostById(id: string, accessToken?: string): Promise<GetPostResponse> {
    const api = getApi(accessToken);
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
}

export async function createPost(
    data: CreatePostRequest,
    accessToken?: string
): Promise<CreatePostResponse> {
    const api = getApi(accessToken);
    const response = await api.post("/api/posts", data);
    return response.data;
}

export async function toggleLike(postId: string, accessToken?: string): Promise<ToggleLikeResponse> {
    const api = getApi(accessToken);
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
}

export async function replyToPost(
    postId: string,
    data: CreatePostRequest,
    accessToken?: string
): Promise<CreatePostResponse> {
    const api = getApi(accessToken);
    const response = await api.post(`/api/posts/${postId}/reply`, data);
    return response.data;
}

export async function deletePost(id: string, accessToken?: string): Promise<{ success: boolean }> {
    const api = getApi(accessToken);
    const response = await api.delete(`/api/posts/${id}`);
    return response.data;
}

export async function getUserPosts(userId: string, accessToken?: string): Promise<{ data: Post[] }> {
    const api = getApi(accessToken);
    const response = await api.get(`/api/posts/user/${userId}`);
    return response.data;
} 
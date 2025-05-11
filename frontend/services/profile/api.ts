import getApi from "@/utils/axios";

export async function getProfile(id: string, accessToken?: string) {
    const api = getApi(accessToken);
    const response = await api.get(`/api/profiles/${id}`);
    return response.data;
}

export async function getRandomProfiles(accessToken?: string) {
    const api = getApi(accessToken);
    const response = await api.get("/api/profiles/random");
    return response.data;
}

export async function searchProfiles(query: string, accessToken?: string) {
    const api = getApi(accessToken);
    const response = await api.get("/api/profiles/search", { params: { query } });
    return response.data;
}

export async function updateProfile(
    data: {
        name: string;
        bio?: string;
        avatar_url?: string;
        is_public?: boolean;
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.put("/api/profiles", data);
    return response.data;
}

export async function getUploadUrl(fileType: string, accessToken?: string) {
    const api = getApi(accessToken);
    const response = await api.post("/api/profiles/upload-url", { fileType });
    return response.data;
} 
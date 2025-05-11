import api from "@/utils/axios";

export async function getProfile(id: string) {
    const response = await api.get(`/api/profiles/${id}`);
    return response.data;
}

export async function getRandomProfiles() {
    const response = await api.get("/api/profiles/random");
    return response.data;
}

export async function searchProfiles(query: string) {
    const response = await api.get("/api/profiles/search", { params: { query } });
    return response.data;
}

export async function updateProfile(data: {
    name: string;
    bio?: string;
    avatar_url?: string;
}) {
    const response = await api.put("/api/profiles", data);
    return response.data;
}

export async function getUploadUrl(fileType: string) {
    const response = await api.post("/api/profiles/upload-url", { fileType });
    return response.data;
} 
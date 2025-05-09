import api from "@/utils/axios";

export async function createDomain(domain: string) {
    const response = await api.post("/api/domain/new", { domain });
    return response.data;
}
import api from "@/utils/axios";

export interface Domain {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateDomainResponse {
    success: boolean;
    data: Domain;
}

export interface GetDomainsResponse {
    success: boolean;
    data: Domain[];
}

export interface GetDomainResponse {
    success: boolean;
    data: Domain;
}

export async function createDomain(data: { name: string; description?: string }): Promise<CreateDomainResponse> {
    const response = await api.post("/api/domain", data);
    return response.data;
}

export async function getDomains(): Promise<GetDomainsResponse> {
    const response = await api.get("/api/domain");
    return response.data;
}

export async function getDomain(id: string): Promise<GetDomainResponse> {
    const response = await api.get(`/api/domain/${id}`);
    return response.data;
}
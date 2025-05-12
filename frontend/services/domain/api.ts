import getApi from "@/utils/axios";

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

export async function createDomain(
    data: { name: string; description?: string },
    accessToken?: string
): Promise<CreateDomainResponse> {
    const api = getApi(accessToken);
    const response = await api.post("/api/domains", data);
    return response.data;
}

export async function getDomains(accessToken?: string): Promise<GetDomainsResponse> {
    const api = getApi(accessToken);
    const response = await api.get("/api/domains");
    return response.data;
}

export async function getDomain(id: string, accessToken?: string): Promise<GetDomainResponse> {
    const api = getApi(accessToken);
    const response = await api.get(`/api/domains/${id}`);
    return response.data;
}
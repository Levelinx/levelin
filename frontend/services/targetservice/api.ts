import getApi from "@/utils/axios";

export async function createTarget(
    data: {
        title: string;
        description: string;
        domain_id: string;
        difficulty: "beginner" | "intermediate" | "advanced";
        proof_requirements: string;
        media_urls?: string[];
        deadline?: string;
        token_fee: number;
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.post("/api/targets", data);
    return response.data;
}

export async function getTargets(
    params?: {
        domain_id?: string;
        status?: "created" | "accepted" | "submitted" | "reviewing" | "completed" | "finalized" | "failed" | "open";
        difficulty?: "beginner" | "intermediate" | "advanced";
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.get("/api/targets", { params });
    return response.data;
}

export async function getTargetById(
    id: string,
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.get(`/api/targets/${id}`);
    return response.data;
}

export async function submitTarget(
    targetId: string, 
    data: {
        description: string;
        proof_url: string;
        media_urls?: string[];
        notes?: string;
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.post(`/api/targets/${targetId}/submit`, data);
    return response.data;
}

export async function reviewSubmission(
    submissionId: string, 
    data: {
        feedback: string;
        status: "approved" | "rejected";
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.post(`/api/targets/submissions/${submissionId}/review`, data);
    return response.data;
}

export async function getUserTargets(
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.get("/api/targets/my-targets");
    return response.data;
}

export async function getUserSubmissions(
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.get("/api/targets/my-submissions");
    return response.data;
} 
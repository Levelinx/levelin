import getApi from "@/utils/axios";

export async function createChallenge(
    data: {
        title: string;
        description: string;
        domain_id: string;
        difficulty: "beginner" | "intermediate" | "advanced";
        requirements: string[];
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.post("/api/challenges", data);
    return response.data;
}

export async function getChallenges(
    params?: {
        domain_id?: string;
        status?: "open" | "closed" | "in_review";
        difficulty?: "beginner" | "intermediate" | "advanced";
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.get("/api/challenges", { params });
    return response.data;
}

export async function submitChallenge(
    challengeId: string, 
    data: {
        submission_url: string;
        notes?: string;
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.post(`/api/challenges/${challengeId}/submit`, data);
    return response.data;
}

export async function reviewChallenge(
    submissionId: string, 
    data: {
        rating: number;
        feedback: string;
        status: "approved" | "rejected";
    },
    accessToken?: string
) {
    const api = getApi(accessToken);
    const response = await api.post(`/api/challenges/submissions/${submissionId}/review`, data);
    return response.data;
} 
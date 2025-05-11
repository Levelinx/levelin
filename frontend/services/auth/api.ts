import { api } from "@/utils/axios";

interface SignupResponse {
    success: boolean;
    data: any;
}

interface MeResponse {
    success: boolean;
    data: {
        id: string;
        privy_id: string;
        name: string;
        email: string;
        date_of_birth: string | null;
        ethereum_wallet: string;
        solana_wallet: string;
        bio: string | null;
        avatar_url: string | null;
        is_public: boolean;
        created_at: string;
        updated_at: string;
        onboarding_completed: boolean;
    }[];
}

export const signup = async (): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>("/api/auth/signup");

    return response.data;
};

export const me = async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>("/api/auth/me");
    const userData = response.data.data?.[0];
    if (!userData) {
        throw new Error("User data not found");
    }
    if (userData && (!userData.name || !userData.bio || !userData.avatar_url)) {
        response.data.data[0].onboarding_completed = false;
    } else {
        response.data.data[0].onboarding_completed = true;
    }
    return response.data;
};

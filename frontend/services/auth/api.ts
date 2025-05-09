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
        created_at: string;
        updated_at: string;
    }[];
}

export const signup = async (): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>("/api/auth/signup");
    return response.data;
};

export const me = async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>("/api/auth/me");
    return response.data;
};

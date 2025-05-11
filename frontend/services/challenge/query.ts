import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useChallenges = (params?: {
    domain_id?: string;
    status?: "open" | "closed" | "in_review";
    difficulty?: "beginner" | "intermediate" | "advanced";
}) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["challenges", params],
        queryFn: () => getChallenges(params, token),
        enabled: !!token,
    });
}; 
import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "./api";

export const useChallenges = (params?: {
    domain_id?: string;
    status?: "open" | "closed" | "in_review";
    difficulty?: "beginner" | "intermediate" | "advanced";
}) => {
    return useQuery({
        queryKey: ["challenges", params],
        queryFn: () => getChallenges(params),
    });
}; 
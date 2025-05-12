import { useQuery } from "@tanstack/react-query";
import { getTargets, getTargetById, getUserTargets, getUserSubmissions } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useTargets = (params?: {
    domain_id?: string;
    status?: "created" | "accepted" | "submitted" | "reviewing" | "completed" | "finalized" | "failed" | "open";
    difficulty?: "beginner" | "intermediate" | "advanced";
}) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["targets", params],
        queryFn: () => getTargets(params, token),
        enabled: !!token,
    });
};

export const useTargetById = (id: string) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["targets", id],
        queryFn: () => getTargetById(id, token),
        enabled: !!id && !!token,
    });
};

export const useUserTargets = () => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["targets", "user"],
        queryFn: () => getUserTargets(token),
        enabled: !!token,
    });
};

export const useUserSubmissions = () => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["targets", "submissions", "user"],
        queryFn: () => getUserSubmissions(token),
        enabled: !!token,
    });
}; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTarget, submitTarget, reviewSubmission } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useCreateTarget = () => {
    const queryClient = useQueryClient();
    const token = usePrivyToken();

    return useMutation({
        mutationFn: (data: Parameters<typeof createTarget>[0]) => 
            createTarget(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            toast.success("Target created successfully");
        },
        onError: () => {
            toast.error("Failed to create target");
        },
    });
};

export const useSubmitTarget = () => {
    const queryClient = useQueryClient();
    const token = usePrivyToken();

    return useMutation({
        mutationFn: ({ targetId, data }: { targetId: string; data: Parameters<typeof submitTarget>[1] }) =>
            submitTarget(targetId, data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            toast.success("Submission added successfully");
        },
        onError: () => {
            toast.error("Failed to submit proof");
        },
    });
};

export const useReviewSubmission = () => {
    const queryClient = useQueryClient();
    const token = usePrivyToken();

    return useMutation({
        mutationFn: ({ submissionId, data }: { submissionId: string; data: Parameters<typeof reviewSubmission>[1] }) =>
            reviewSubmission(submissionId, data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            toast.success("Review submitted successfully");
        },
        onError: () => {
            toast.error("Failed to submit review");
        },
    });
}; 
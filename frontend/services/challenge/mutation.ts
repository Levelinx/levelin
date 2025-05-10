import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createChallenge, submitChallenge, reviewChallenge } from "./api";

export const useCreateChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createChallenge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["challenges"] });
            toast.success("Challenge created successfully");
        },
        onError: () => {
            toast.error("Failed to create challenge");
        },
    });
};

export const useSubmitChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ challengeId, data }: { challengeId: string; data: any }) =>
            submitChallenge(challengeId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["challenges"] });
            toast.success("Challenge submitted successfully");
        },
        onError: () => {
            toast.error("Failed to submit challenge");
        },
    });
};

export const useReviewChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ submissionId, data }: { submissionId: string; data: any }) =>
            reviewChallenge(submissionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["challenges"] });
            toast.success("Review submitted successfully");
        },
        onError: () => {
            toast.error("Failed to submit review");
        },
    });
}; 
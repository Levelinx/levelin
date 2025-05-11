import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDomain } from "./api";
import { toast } from "sonner";

export const useCreateDomain = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDomain,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
            toast.success("Domain created successfully");
        },
        onError: (error) => {
            toast.error("Failed to create domain");
            console.error("Create domain error:", error);
        },
    });
};
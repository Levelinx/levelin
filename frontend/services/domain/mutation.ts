import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDomain } from "./api";
import { toast } from "sonner";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useCreateDomain = () => {
    const queryClient = useQueryClient();
    const token = usePrivyToken();

    return useMutation({
        mutationFn: (data: Parameters<typeof createDomain>[0]) => 
            createDomain(data, token),
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
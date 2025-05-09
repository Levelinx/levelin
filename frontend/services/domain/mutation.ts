import { createDomain } from "./api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateDomain = (domain: string) => {
    return useMutation({
        mutationFn: () => createDomain(domain),
        onSuccess: () => {
            toast.success("Domain created successfully");
        },
        onError: () => {
            toast.error("Failed to create domain");
        },
    });
}
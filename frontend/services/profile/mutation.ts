import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile, getUploadUrl } from "./api";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
            toast.success("Profile updated successfully");
        },
        onError: () => {
            toast.error("Failed to update profile");
        },
    });
};

export const useGetUploadUrl = () => {
    return useMutation({
        mutationFn: getUploadUrl,
        onError: () => {
            toast.error("Failed to get upload URL");
        },
    });
}; 
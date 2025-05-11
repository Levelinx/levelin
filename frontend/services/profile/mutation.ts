import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile, getUploadUrl } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const token = usePrivyToken();

    return useMutation({
        mutationFn: (data: Parameters<typeof updateProfile>[0]) => 
            updateProfile(data, token),
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
    const token = usePrivyToken();
    
    return useMutation({
        mutationFn: (fileType: string) => getUploadUrl(fileType, token),
        onError: () => {
            toast.error("Failed to get upload URL");
        },
    });
}; 
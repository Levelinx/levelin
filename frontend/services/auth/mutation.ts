import { useMutation } from "@tanstack/react-query";
import { signup } from "./api";
import { toast } from "sonner";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useSignup = () => {
    const token = usePrivyToken();
    
    return useMutation({
        mutationFn: () => signup(token),
        onSuccess: () => {
            toast.success("Logged in successfully");
        },
        onError: (error) => {
            toast.error("Something went wrong");
        },
    });
};
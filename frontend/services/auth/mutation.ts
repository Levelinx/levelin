import { useMutation } from "@tanstack/react-query";
import { signup } from "./api";
import { toast } from "sonner";

export const useSignup = () => {
    return useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Logged in successfully");
        },
        onError: (error) => {
            toast.error("Something went wrong");
        },
    });
};
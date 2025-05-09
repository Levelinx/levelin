import { initializeProgram, registerUser, createDomainOnChain, addDomainToUser } from './api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useInitialiseTransaction = (wallet: any) => {
    return useMutation({
        mutationFn: () => initializeProgram(wallet),
        onSuccess: (data) => {
            console.log("Success", data);
            toast.success("Transaction successful");
        },
        onError: (error) => {
            console.log("Error", error);
            toast.error("Transaction failed");
        }
    });
};

export const useCreateDomainTransaction = (wallet: any, domain: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => createDomainOnChain(wallet, domain.name, domain.description),
        onSuccess: (data) => {
            console.log("Success", data);
            if (data.success) {
                toast.success("Domain created successfully!");
                queryClient.invalidateQueries({ queryKey: ["allDomains", wallet.address] });
            } else {
                toast.error(`Failed to create domain`);
            }
        },
        onError: (error) => {
            console.log("Error", error);
            toast.error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
};

export const useRegisterUserTransaction = (wallet: any, user: any) => {
    return useMutation({
        mutationFn: () => registerUser(wallet, user.name, user.dateOfBirth, user.email),
        onSuccess: (data) => {
            console.log("Success", data);
            toast.success("Transaction successful");
        },
        onError: (error) => {
            console.log("Error", error);
            toast.error("Transaction failed");
        }
    });
};

export const useAddDomainToUserTransaction = (wallet: any, user: any, domain: any) => {
    return useMutation({
        mutationFn: () => addDomainToUser(wallet, user.address, domain.address, domain.name),
        onSuccess: (data) => {
            console.log("Success", data);
            toast.success("Transaction successful");
        },
        onError: (error) => {
            console.log("Error", error);
            toast.error("Transaction failed");
        }
    });
};
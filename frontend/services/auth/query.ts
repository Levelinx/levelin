import { useQuery } from "@tanstack/react-query";
import { me } from "./api";

export const useMe = () => {
    return useQuery({ 
        queryKey: ["me"], 
        queryFn: me,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        staleTime: 1000 * 60 * 10,
        retry: false,
        retryDelay: 0,
    });
};

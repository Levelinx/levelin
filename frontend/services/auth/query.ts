import { useQuery } from "@tanstack/react-query";
import { me } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useMe = () => {
    const token = usePrivyToken();
    
    return useQuery({ 
        queryKey: ["me"], 
        queryFn: () => me(token),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        staleTime: 1000 * 60 * 10,
        retry: false,
        retryDelay: 0,
        enabled: !!token, // Only run the query when we have a token
    });
};

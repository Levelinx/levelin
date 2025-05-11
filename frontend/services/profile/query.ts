import { useQuery } from "@tanstack/react-query";
import { getProfile, getRandomProfiles, searchProfiles } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useProfile = (id: string) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["profile", id],
        queryFn: () => getProfile(id, token),
        enabled: !!id && !!token,
    });
};

export const useRandomProfiles = () => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["random-profiles"],
        queryFn: () => getRandomProfiles(token),
        enabled: !!token,
    });
};

export const useSearchProfiles = (query: string) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["search-profiles", query],
        queryFn: () => searchProfiles(query, token),
        enabled: !!query && !!token,
    });
}; 
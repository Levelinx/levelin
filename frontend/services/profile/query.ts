import { useQuery } from "@tanstack/react-query";
import { getProfile, getRandomProfiles, searchProfiles } from "./api";

export const useProfile = (id: string) => {
    return useQuery({
        queryKey: ["profile", id],
        queryFn: () => getProfile(id),
        enabled: !!id,
    });
};

export const useRandomProfiles = () => {
    return useQuery({
        queryKey: ["random-profiles"],
        queryFn: getRandomProfiles,
    });
};

export const useSearchProfiles = (query: string) => {
    return useQuery({
        queryKey: ["search-profiles", query],
        queryFn: () => searchProfiles(query),
        enabled: !!query,
    });
}; 
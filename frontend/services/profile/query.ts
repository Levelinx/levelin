import { useQuery } from "@tanstack/react-query";
import { getProfile, getRandomProfiles } from "./api";

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
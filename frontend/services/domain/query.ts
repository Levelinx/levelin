import { useQuery } from "@tanstack/react-query";
import { getDomain, getDomains } from "./api";

export const useDomains = () => {
    return useQuery({
        queryKey: ["domains"],
        queryFn: getDomains,
    });
};

export const useDomain = (id: string) => {
    return useQuery({
        queryKey: ["domain", id],
        queryFn: () => getDomain(id),
        enabled: !!id,
    });
}; 
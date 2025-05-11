import { useQuery } from "@tanstack/react-query";
import { getDomain, getDomains } from "./api";
import usePrivyToken from "@/hooks/usePrivyToken";

export const useDomains = () => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["domains"],
        queryFn: () => getDomains(token),
        enabled: !!token,
    });
};

export const useDomain = (id: string) => {
    const token = usePrivyToken();
    
    return useQuery({
        queryKey: ["domain", id],
        queryFn: () => getDomain(id, token),
        enabled: !!id && !!token,
    });
}; 
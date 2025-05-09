import { useQuery } from "@tanstack/react-query";
import { getAllDomains, isWalletProgramAuthority } from "./api";


export const useProgramAuthority = (programAddress: string) => {
    return useQuery({
        queryKey: ["programAuthority", programAddress],
        queryFn: () => isWalletProgramAuthority(programAddress),
        enabled: !!programAddress,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
}

/**
 * Hook to get all domains
 * @param walletAddress Wallet address
 */
export const useGetAllDomains = (walletAddress: string) => {
    return useQuery({
      queryKey: ["allDomains", walletAddress],
      queryFn: () => getAllDomains(walletAddress),
      enabled: !!walletAddress,
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 60 * 1000, // Refetch every minute
      refetchOnWindowFocus: true,
      // On successful creation of a domain, we'll invalidate this query
    });
  };
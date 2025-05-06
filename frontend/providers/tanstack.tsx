'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {PrivyProvider} from '@privy-io/react-auth';
const OneHoureInMs = 60 * 60 * 1000;

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        retry: false,
        staleTime: OneHoureInMs,
        gcTime: Infinity,
      },
    },
  }
);

const TanstackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
      appId="your-privy-app-id"
      clientId="your-app-client-id"
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      {children}
    </PrivyProvider>
  </QueryClientProvider>
  );
};

export default TanstackProvider;
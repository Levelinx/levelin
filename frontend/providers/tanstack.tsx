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
      appId="cmabmawrc00fdl80nh8wxiqur"
      clientId="client-WY6LFzQxDD9JgtMq9Go3aNKSGZuBAVnpfod6u5rDro6pS"
      config={{appearance: {logo: "/images/logo2.0.png", landingHeader: "Login or Signup", loginMessage: "Levelin" }}}
    >
      {children}
    </PrivyProvider>
  </QueryClientProvider>
  );
};

export default TanstackProvider;
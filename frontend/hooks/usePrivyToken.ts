import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

/**
 * Custom hook to get the current Privy access token
 * @returns The current access token or undefined if not available
 */
export function usePrivyToken() {
  const { getAccessToken, authenticated } = usePrivy();
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (authenticated) {
      const fetchToken = async () => {
        try {
          const accessToken = await getAccessToken();
          // Handle potential null value from getAccessToken
          if (accessToken) {
            setToken(accessToken);
          }
        } catch (error) {
          console.error('Error getting Privy token:', error);
        }
      };
      
      fetchToken();
      
      // Set up a refresh interval (e.g., every 5 minutes)
      const intervalId = setInterval(fetchToken, 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [authenticated, getAccessToken]);

  return token;
}

export default usePrivyToken; 
import { useIsMobile } from '@/hooks/isMobile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import {
  EnvironmentContextProvider,
  InAppWalletProvider,
  MetaMaskProvider,
  OKXProvider,
  WalletContextProvider,
} from 'web3-connect-react';

export const SessionStorageKey = 'session';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const session = sessionStorage.getItem(SessionStorageKey);
  const parsedSession = session ? JSON.parse(session) : { isAuth: false };
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!parsedSession.isAuth) {
      return;
    }
    // If the session is expired, remove it and reload the page
    if (parsedSession.exp * 1000 < Date.now()) {
      sessionStorage.removeItem(SessionStorageKey);
      window.location.reload();
      return;
    }

    // If the session is still valid, get the remaining time and set a timer to refresh the page when the session expires
    const remainingTime = parsedSession.exp * 1000 - Date.now();
    const timer = setTimeout(() => {
      sessionStorage.removeItem(SessionStorageKey);
      window.location.reload();
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    const currentLocationWithQuery = window.location.href;

    if (!session && currentLocationWithQuery.includes('?id')) {
      window.location.href = `/chat`;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EnvironmentContextProvider isMobile={isMobile} isTest={false}>
        <WalletContextProvider
          session={parsedSession}
          providers={[OKXProvider, MetaMaskProvider, InAppWalletProvider]}
          onSignedOut={async () => {
            sessionStorage.removeItem(SessionStorageKey);
          }}
          walletConfig={
            process.env.NODE_ENV === 'development'
              ? {
                  defaultChainConfigs: {
                    solana: {
                      rpcUrl:
                        'https://rapidities-ignobleness-lzasmdnalw-dedicated.helius-rpc.com?api-key=d57e523a-d5f1-4b2d-839d-e537f676db7a',
                    },
                  },
                }
              : {
                  defaultChainConfigs: {
                    solana: {
                      rpcUrl:
                        'https://rapidities-ignobleness-lzasmdnalw-dedicated.helius-rpc.com?api-key=d57e523a-d5f1-4b2d-839d-e537f676db7a',
                    },
                  },
                }
          }
          listenToAccountChanges={false}
          listenToChainChanges={false}
        >
          {children}
        </WalletContextProvider>
      </EnvironmentContextProvider>
    </QueryClientProvider>
  );
}

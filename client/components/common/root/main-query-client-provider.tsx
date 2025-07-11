'use client';

import { BadResponse } from '@/lib/api/type';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { PropsWithChildren } from 'react';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5,
      staleTime: 1000 * 60,
    },
    mutations: {
      gcTime: 1000 * 60 * 5,
    },
  },
  mutationCache: new MutationCache({
    onMutate: (variables) => {
      console.log('[✨Mutating✨]: ', variables);
    },
    onError: (error: Error | BadResponse) => {
      if (error instanceof BadResponse) {
        toast.error(error.message);
      }
    },
  }),
  queryCache: new QueryCache({
    onError: (error: Error | BadResponse) => {
      if (error instanceof BadResponse) {
        toast.error(error.message);
      }
    },
  }),
});

export function MainQueryClientProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

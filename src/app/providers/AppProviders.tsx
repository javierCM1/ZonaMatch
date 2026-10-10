import type { PropsWithChildren } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../../core/query/query-client'
import { LoadingOverlay } from '../../shared/components/loading-overlay'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        {children}
        <LoadingOverlay />
      </PrimeReactProvider>
    </QueryClientProvider>
  )
}

import { useLoadingStore } from '../../../core/loading'
import { ProgressSpinner } from '../progress-spinner'

/**
 * Purpose: full-screen overlay driven by the global loading service.
 * Props: none. Mount it once (see AppProviders) and trigger it with `loadingService`.
 */
export function LoadingOverlay() {
  const isLoading = useLoadingStore((state) => state.pendingCount > 0)
  const message = useLoadingStore((state) => state.message)

  if (!isLoading) {
    return null
  }

  return (
    <div
      aria-busy="true"
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-[1px]"
    >
      <ProgressSpinner label={message ?? 'Cargando'} size="lg" />
      {message && <p className="text-sm font-medium text-[#26372d]">{message}</p>}
    </div>
  )
}

import { create } from 'zustand'

interface LoadingState {
  /** Number of active operations; the overlay is visible while it is greater than zero. */
  pendingCount: number
  message: string | null
  start: (message?: string) => void
  stop: () => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  pendingCount: 0,
  message: null,
  start: (message) =>
    set((state) => ({
      pendingCount: state.pendingCount + 1,
      message: message ?? state.message,
    })),
  stop: () =>
    set((state) => {
      const pendingCount = Math.max(0, state.pendingCount - 1)

      return { pendingCount, message: pendingCount === 0 ? null : state.message }
    }),
}))

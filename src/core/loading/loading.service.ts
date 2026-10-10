import { useLoadingStore } from './loading.store'

/**
 * Global loading service, callable from anywhere (components, hooks, services).
 *
 * Usage:
 *   const result = await loadingService.track(registerUser(payload), 'Creando cuenta...')
 */
export const loadingService = {
  show(message?: string): void {
    useLoadingStore.getState().start(message)
  },

  hide(): void {
    useLoadingStore.getState().stop()
  },

  /** Shows the loader while `task` is pending and always hides it afterwards. */
  async track<T>(task: Promise<T>, message?: string): Promise<T> {
    loadingService.show(message)

    try {
      return await task
    } finally {
      loadingService.hide()
    }
  },
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isTokenValid } from './auth.utils'

const AUTH_STORAGE_KEY = 'zonamatch-auth'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  setAuthenticated: (isAuthenticated: boolean) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
}

type PersistedAuthState = Pick<AuthState, 'accessToken' | 'isAuthenticated'>

export const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], PersistedAuthState>(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      setAuthenticated: (isAuthenticated) =>
        set((state) => ({
          isAuthenticated,
          accessToken: isAuthenticated ? state.accessToken : null,
        })),
      setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
      logout: () => set({ accessToken: null, isAuthenticated: false }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      // sessionStorage: the session ends when the tab closes, reducing exposure of the token.
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
      partialize: (state) => ({ accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
      // Discard a persisted token that already expired.
      merge: (persisted, current) => {
        const token = (persisted as Partial<AuthState> | undefined)?.accessToken ?? null

        return isTokenValid(token)
          ? { ...current, accessToken: token, isAuthenticated: true }
          : { ...current, accessToken: null, isAuthenticated: false }
      },
    },
  ),
)

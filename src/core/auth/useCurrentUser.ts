import { useAuthStore } from './auth.store'
import { getInitials, getUserNameFromToken, isTokenValid } from './auth.utils'

export interface CurrentUser {
  isAuthenticated: boolean
  name: string | null
  initials: string
}

export function useCurrentUser(): CurrentUser {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = isTokenValid(accessToken)
  const name = isAuthenticated ? getUserNameFromToken(accessToken) : null

  return { isAuthenticated, name, initials: name ? getInitials(name) : '' }
}

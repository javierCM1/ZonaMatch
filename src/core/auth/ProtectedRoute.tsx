import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { isTokenValid } from './auth.utils'

/**
 * Purpose: guards a group of routes; unauthenticated users are sent to /login.
 * Usage: { element: <ProtectedRoute />, children: [...privateRoutes] }
 */
export function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  if (!isTokenValid(accessToken)) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}

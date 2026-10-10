import { Outlet, ScrollRestoration, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../../shared/layouts/AppLayout'
import { ProtectedRoute } from '../../core/auth/ProtectedRoute'
import { authRoutes } from '../../features/auth/auth.routes'
import { landingRoutes } from '../../features/landing/landing.routes'
import { legalRoutes } from '../../features/legal/legal.routes'
import { locationExplorerRoutes } from '../../features/location-explorer/location-explorer.routes'
import { siteAnalysisRoutes } from '../../features/site-analysis/site-analysis.routes'
import { detailedAnalysisRoutes } from '../../features/detailed-analysis/detailed-analysis.routes'
import { zoneDetailRoutes } from '../../features/zone-detail/zone-detail.routes'

function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...authRoutes,
      ...landingRoutes,
      ...legalRoutes,
      {
        element: <AppLayout />,
        children: [
          ...locationExplorerRoutes,
          ...siteAnalysisRoutes,
          ...zoneDetailRoutes,
          // El análisis detallado requiere sesión: sin token, ProtectedRoute redirige a /login.
          {
            element: <ProtectedRoute />,
            children: detailedAnalysisRoutes,
          },
        ],
      },
    ],
  },
])
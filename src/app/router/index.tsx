import { Outlet, ScrollRestoration, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../../shared/layouts/AppLayout'
import { landingRoutes } from '../../features/landing/landing.routes'
import { legalRoutes } from '../../features/legal/legal.routes'
import { locationExplorerRoutes } from '../../features/location-explorer/location-explorer.routes'
import { siteAnalysisRoutes } from '../../features/site-analysis/site-analysis.routes'

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
      ...landingRoutes,
      ...legalRoutes,
      {
        element: <AppLayout />,
        children: [...locationExplorerRoutes, ...siteAnalysisRoutes],
      },
    ],
  },
])
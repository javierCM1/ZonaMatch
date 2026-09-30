import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../../shared/layouts/AppLayout'
import { landingRoutes } from '../../features/landing/landing.routes'
import { locationExplorerRoutes } from '../../features/location-explorer/location-explorer.routes'
import { siteAnalysisRoutes } from '../../features/site-analysis/site-analysis.routes'

export const appRouter = createBrowserRouter([
  ...landingRoutes,
  {
    element: <AppLayout />,
    children: [...locationExplorerRoutes, ...siteAnalysisRoutes],
  },
])

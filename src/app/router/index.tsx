import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../../shared/layouts/AppLayout'
import { HomePage } from '../../features/home/pages/HomePage'
import { locationExplorerRoutes } from '../../features/location-explorer/location-explorer.routes'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    element: <AppLayout />,
    children: locationExplorerRoutes,
  },
])

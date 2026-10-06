import type { RouteObject } from 'react-router-dom'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'

export const legalRoutes: RouteObject[] = [
  {
    path: '/terminos',
    element: <TermsPage />,
  },
  {
    path: '/privacidad',
    element: <PrivacyPage />,
  },
]
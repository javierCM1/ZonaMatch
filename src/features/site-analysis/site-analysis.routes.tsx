import type { RouteObject } from 'react-router-dom'

import { SiteAnalysisPage } from './pages/SiteAnalysisPage'

export const siteAnalysisRoutes: RouteObject[] = [
	{
		path: 'analisis',
		element: <SiteAnalysisPage />,
	},
]

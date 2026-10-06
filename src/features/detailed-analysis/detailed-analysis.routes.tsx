import type { RouteObject } from 'react-router-dom'

import { DetailedAnalysisPage } from './pages/DetailedAnalysisPage'

export const detailedAnalysisRoutes: RouteObject[] = [
	{
		path: 'analisis-detallado',
		element: <DetailedAnalysisPage />,
	},
]
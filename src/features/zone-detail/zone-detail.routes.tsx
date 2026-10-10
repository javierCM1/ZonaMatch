import type { RouteObject } from 'react-router-dom'

import { ZoneDetailPage } from './pages/ZoneDetailPage'
import { ZonesPage } from './pages/ZonesPage'

export const zoneDetailRoutes: RouteObject[] = [
	{
		path: 'zonas',
		element: <ZonesPage />,
	},
	{
		path: 'zonas/:zoneId',
		element: <ZoneDetailPage />,
	},
]

import type { RouteObject } from 'react-router-dom';

import { LocationExplorerPage } from './pages/LocationExplorerPage';

export const locationExplorerRoutes: RouteObject[] = [
  {
    path: 'explorar',
    element: <LocationExplorerPage />,
  },
];
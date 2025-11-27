import { RouteObject } from 'react-router';

import NotFoundPage from '@/pages/not-found.page';

import discoverRefillRoutes from './discover/discover.routes';
import RefillPlacesPage from './refill.page';

const routes: RouteObject[] = [
  {
    path: '/:postcode/refill',
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <RefillPlacesPage />,
      },
      {
        path: '/:postcode/refill/map',
        element: <NotFoundPage />,
      },
      {
        path: '/:postcode/refill/:placeName/:placePostcode',
        element: <NotFoundPage />,
      },
      ...discoverRefillRoutes,
    ],
  },
];

export default routes;

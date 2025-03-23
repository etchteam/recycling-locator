import { RouteObject } from 'react-router-dom';

import NotFoundPage from '@/pages/not-found.page';

import homeRecyclingRoutes from './home/home.routes';
import materialRoutes from './material/material.routes';
import placesRoutes from './places/places.routes';
import postcodeAction from './postcode.action';
import postcodeLoader from './postcode.loader';
import PostcodePage from './postcode.page';
import RescueMeRecyclePage from './rescue-me-recycle';

const routes: RouteObject[] = [
  {
    path: '/:postcode',
    errorElement: <NotFoundPage />,
    // This loader validates the postcode for all child routes
    loader: postcodeLoader,
    id: 'postcode',
    children: [
      {
        index: true,
        element: <PostcodePage />,
        action: postcodeAction,
      },
      {
        path: '/:postcode/rescue-me-recycle',
        element: <RescueMeRecyclePage />,
      },
      ...materialRoutes,
      ...homeRecyclingRoutes,
      ...placesRoutes,
    ],
  },
];

export default routes;

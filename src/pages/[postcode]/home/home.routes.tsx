import { RouteObject } from 'react-router';

import homeCollectionLoader from './collection.loader';
import CollectionPage from './collection.page';
import HomeRecyclingContactPage from './contact.page';
import HomeRecyclingErrorPage from './error.page';
import HomeRecyclingLayout from './home.layout';
import homeRecyclingLoader from './home.loader';
import HomeRecyclingPage from './home.page';
import homeRecyclingCentreLoader from './recycling-centre.loader';
import HomeRecyclingCentrePage from './recycling-centre.page';

const routes: RouteObject[] = [
  {
    path: '/:postcode/home',
    loader: homeRecyclingLoader,
    id: 'home-recycling',
    errorElement: <HomeRecyclingErrorPage />,
    children: [
      {
        element: <HomeRecyclingLayout />,
        children: [
          {
            index: true,
            element: <HomeRecyclingPage />,
          },
          {
            path: 'recycling-centre',
            element: <HomeRecyclingCentrePage />,
            loader: homeRecyclingCentreLoader,
          },
          {
            path: 'contact',
            element: <HomeRecyclingContactPage />,
          },
        ],
      },
      {
        path: 'collection',
        loader: homeCollectionLoader,
        element: <CollectionPage />,
      },
    ],
  },
];

export default routes;

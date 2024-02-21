import { RouteObject } from 'react-router-dom';

import postcodeAction from '../postcode.action';

import MaterialLayout from './material.layout';
import materialLoader from './material.loader';
import MaterialPage from './material.page';
import notFoundLoader from './not-found.loader';
import NotFoundPage from './not-found.page';

const routes: RouteObject[] = [
  {
    path: '/:postcode/material',
    element: <MaterialLayout />,
    children: [
      { index: true, element: <MaterialPage />, loader: materialLoader },
      {
        path: 'not-found',
        element: <NotFoundPage />,
        action: postcodeAction,
        loader: notFoundLoader,
      },
    ],
  },
];

export default routes;

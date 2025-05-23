import { RouteObject } from 'react-router';

import HomeRecyclingStartPage from './home-recycling.page';
import MaterialStartPage from './material.page';
import NotFoundPage from './not-found.page';
import startAction, {
  homeRecyclingStartAction,
  materialStartAction,
} from './start.action';
import startLoader from './start.loader';
import StartPage from './start.page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <StartPage />,
    action: startAction,
    loader: startLoader,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/home-recycling',
    element: <HomeRecyclingStartPage />,
    action: homeRecyclingStartAction,
    loader: startLoader,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/material',
    element: <MaterialStartPage />,
    action: materialStartAction,
    loader: startLoader,
    errorElement: <NotFoundPage />,
  },
];

export default routes;

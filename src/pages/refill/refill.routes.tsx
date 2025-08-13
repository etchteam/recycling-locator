import { RouteObject } from 'react-router';

import RefillErrorPage from './error.page';
import ExamplePage from './example.page';
import GuidePage from './guide.page';
import OptionsPage from './options.page';
import RefillLayout from './refill.layout';
import RefillPage from './refill.page';

const routes: RouteObject[] = [
  {
    path: '/refill',
    errorElement: <RefillErrorPage />,
    children: [
      {
        index: true,
        element: <RefillPage />,
      },
      {
        element: <RefillLayout />,
        children: [
          {
            path: 'guide',
            element: <GuidePage />,
          },
          {
            path: 'options',
            element: <OptionsPage />,
          },
          {
            path: 'benefits',
            element: <ExamplePage title="Benefits" />,
          },
          {
            path: 'sign-up',
            element: <ExamplePage title="Sign Up" />,
          },
        ],
      },
    ],
  },
];

export default routes;

import { RouteObject } from 'react-router';

import BenefitsPage from './benefits.page';
import DiscoverRefillLayout from './discover.layout';
import DiscoverRefillPage from './discover.page';
import DiscoverRefillErrorPage from './error.page';
import GuidePage from './guide.page';
import OptionsPage from './options.page';
import SignUpPage from './sign-up.page';

const routes: RouteObject[] = [
  {
    path: '/:postcode/refill/discover',
    errorElement: <DiscoverRefillErrorPage />,
    children: [
      {
        index: true,
        element: <DiscoverRefillPage />,
      },
      {
        element: <DiscoverRefillLayout />,
        children: [
          {
            path: '/:postcode/refill/discover/guide',
            element: <GuidePage />,
          },
          {
            path: '/:postcode/refill/discover/options',
            element: <OptionsPage />,
          },
          {
            path: '/:postcode/refill/discover/benefits',
            element: <BenefitsPage />,
          },
          {
            path: '/:postcode/refill/discover/sign-up',
            element: <SignUpPage />,
          },
        ],
      },
    ],
  },
];

export default routes;

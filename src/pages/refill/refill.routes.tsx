import { RouteObject } from 'react-router';

import BenefitsPage from './benefits.page';
import RefillErrorPage from './error.page';
import GuidePage from './guide.page';
import OptionsPage from './options.page';
import RefillLayout from './refill.layout';
import RefillPage from './refill.page';
import SignUpPage from './sign-up.page';

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
            element: <BenefitsPage />,
          },
          {
            path: 'sign-up',
            element: <SignUpPage />,
          },
        ],
      },
    ],
  },
];

export default routes;

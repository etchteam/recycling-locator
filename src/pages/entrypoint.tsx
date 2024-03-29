import { Suspense } from 'preact/compat';
import {
  createMemoryRouter,
  RouteObject,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import '@/components/content/Icon/Icon';
import '@/components/canvas/Loading/Loading';
import '@/components/canvas/Hero/Hero';
import '@/lib/sentry';
import { RecyclingLocatorAttributes } from '@/index';
import { AppState, createAppState } from '@/lib/AppState';
import { i18nInit } from '@/lib/i18n';

import postcodeRoutes from './[postcode]/postcode.routes';
import ErrorPage from './error.page';
import NotFoundPage from './not-found.page';
import RootLayout from './root.layout';
import startAction from './start.action';
import startRoutes from './start.routes';

const routes: RouteObject[] = [
  {
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      ...startRoutes,
      ...postcodeRoutes,
      {
        path: '/*',
        element: <NotFoundPage />,
        action: startAction,
      },
    ],
  },
];

function Loading() {
  return (
    <locator-loading>
      <locator-hero>
        <locator-icon icon="distance" color="muted"></locator-icon>
      </locator-hero>
    </locator-loading>
  );
}

/**
 * Jobs of the entrypoint:
 * - Load up the router
 * - Init i18n (using suspense to wait for them to load in)
 * - Init Sentry
 * - Create the AppState
 * - Setup the start page routes
 * - Lazily register sub routes
 */
export default function Entrypoint(
  props: Readonly<RecyclingLocatorAttributes>,
) {
  const { locale, variant, basename } = props;

  i18nInit(locale);

  const router =
    variant === 'standalone'
      ? createBrowserRouter(routes, { basename })
      : createMemoryRouter(routes);

  return (
    <Suspense fallback={<Loading />}>
      <AppState.Provider value={createAppState(props)}>
        <RouterProvider router={router} />
      </AppState.Provider>
    </Suspense>
  );
}

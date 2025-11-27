import { Suspense } from 'preact/compat';
import {
  createMemoryRouter,
  RouteObject,
  createBrowserRouter,
} from 'react-router';
import { RouterProvider } from 'react-router/dom';

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

/**
 * A flash of this loading fallback often displays before styles or any components have had a
 * chance to load. It'll be swapped out for the actual UI as soon as it's ready.
 */
function Loading() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        // minimum --container-height in case that hasn't loaded yet
        minHeight: '540px',
        // this border will blend in as a fallback in case border styles haven't loaded yet
        border: 'var(--recycling-locator-container-border, 1px solid #cfd1d3)',
        borderRadius: 'var(--recycling-locator-container-border-radius, 0)',
        margin: '-1px -1px 0 -1px',
        boxSizing: 'content-box',
      }}
    />
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

  i18nInit(locale, props.publicPath);

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

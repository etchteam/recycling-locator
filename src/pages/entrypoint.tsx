import { Suspense } from 'preact/compat';
import { Route, Switch } from 'wouter-preact';

import '@/components/canvas/Hero/Hero';
import '@/components/canvas/Loading/Loading';
import '@/components/content/Icon/Icon';
import { RecyclingLocatorAttributes } from '@/index';
import { AppState, createAppState } from '@/lib/AppState';
import ErrorBoundary from '@/lib/ErrorBoundary';
import { PostcodeProvider } from '@/lib/PostcodeContext';
import { WouterProvider } from '@/lib/WouterProvider';
import { i18nInit } from '@/lib/i18n';
import '@/lib/sentry';

import PostcodeRoutes from './[postcode]/PostcodeRoutes';
import GlobalErrorPage from './error.page';
import HomeRecyclingStartPage from './home-recycling.page';
import MaterialStartPage from './material.page';
import NotFoundPage from './not-found.page';
import RefillRoutes from './refill/RefillRoutes';
import RootLayout from './root.layout';
import StartPage from './start.page';

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
  const { locale, variant, basename, path } = props;

  i18nInit(locale, props.publicPath);

  return (
    <Suspense fallback={<Loading />}>
      <WouterProvider
        variant={variant}
        basename={basename}
        initialPath={path || '/'}
      >
        <AppState.Provider value={createAppState(props)}>
          <ErrorBoundary fallback={<GlobalErrorPage />}>
            <RootLayout>
              <Switch>
                <Route path="/" component={StartPage} />
                <Route
                  path="/home-recycling"
                  component={HomeRecyclingStartPage}
                />
                <Route path="/material" component={MaterialStartPage} />
                <Route path="/:postcode/:rest*">
                  <PostcodeProvider>
                    <PostcodeRoutes />
                  </PostcodeProvider>
                </Route>
                <Route path="/refill/:rest*" component={RefillRoutes} />
                <Route component={NotFoundPage} />
              </Switch>
            </RootLayout>
          </ErrorBoundary>
        </AppState.Provider>
      </WouterProvider>
    </Suspense>
  );
}

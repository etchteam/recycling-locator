import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { Route, Switch, useLocation } from 'wouter-preact';

import ErrorBoundary, { ErrorPage } from '@/components/ErrorBoundary';
import { useAppState } from '@/hooks/AppStateProvider';
import useAnalytics from '@/hooks/useAnalytics';

import PostcodeRoutes from './[postcode]/postcode.routes';
import HomeRecyclingStartPage from './home-recycling.page';
import MaterialStartPage from './material.page';
import NotFoundPage from './not-found.page';
import RefillRoutes from './refill/refill.routes';
import StartLayout from './start.layout';
import StartPage from './start.page';

/**
 * The start routes wrap every route in the app and is responsible for
 * navigating to the correct start path then dispatching the 'ready' event.
 */
export default function StartRoutes() {
  const { startPath } = useAppState();
  const [location, setLocation] = useLocation();
  const { recordView } = useAnalytics();
  const loadedStartPath = useSignal<string>('');
  const currentHref = location;

  useEffect(() => {
    if (loadedStartPath.value !== startPath && startPath !== currentHref) {
      setLocation(startPath);
    }

    if (currentHref === startPath) {
      loadedStartPath.value = startPath;
    }
  }, [startPath, currentHref, setLocation]);

  useEffect(() => {
    if (loadedStartPath.value) {
      recordView();
    }
  }, [location, recordView]);

  if (!loadedStartPath.value) {
    return null;
  }

  // Send a ready event when the first route renders
  // this is delayed by 50ms to give the outer page time to add an event listener
  setTimeout(() => {
    const host = document.querySelector('recycling-locator');
    host?.dispatchEvent(new CustomEvent('ready'));
  }, 50);

  return (
    <ErrorBoundary
      fallback={
        <StartLayout>
          <ErrorPage />
        </StartLayout>
      }
    >
      <Switch>
        <Route path="/">
          <StartLayout>
            <StartPage />
          </StartLayout>
        </Route>
        <Route path="/home-recycling">
          <StartLayout>
            <HomeRecyclingStartPage />
          </StartLayout>
        </Route>
        <Route path="/material">
          <StartLayout>
            <MaterialStartPage />
          </StartLayout>
        </Route>
        <Route path="/refill/*?" component={RefillRoutes} />
        <Route path="/:postcode/*?" component={PostcodeRoutes} />
        <Route>
          <StartLayout>
            <NotFoundPage />
          </StartLayout>
        </Route>
      </Switch>
    </ErrorBoundary>
  );
}

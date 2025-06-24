import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { useAppState } from '@/lib/AppState';
import useAnalytics from '@/lib/useAnalytics';

/**
 * The root layout wraps every route in the app.
 * It's responsible for navigating to the correct start path.
 */
export default function RootLayout() {
  const { startPath } = useAppState();
  const navigateTo = useNavigate();
  const location = useLocation();
  const { recordView } = useAnalytics();
  const loadedStartPath = useSignal<string>('');
  const currentHref = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (loadedStartPath.value !== startPath && startPath !== currentHref) {
      navigateTo(startPath);
    }

    if (currentHref === startPath) {
      loadedStartPath.value = startPath;
    }
  }, [startPath, currentHref]);

  useEffect(() => {
    if (loadedStartPath.value) {
      recordView();
    }
  }, [location]);

  if (!loadedStartPath.value) {
    return null;
  }

  // Send a ready event when the first route renders
  // this is delayed by 50ms to give the outer page time to add an event listener
  setTimeout(() => {
    const host = document.querySelector('recycling-locator');
    host?.dispatchEvent(new CustomEvent('ready'));
  }, 50);

  return <Outlet />;
}

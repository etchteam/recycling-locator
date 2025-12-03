import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

import { useAppState } from '@/lib/AppState';
import useAnalytics from '@/lib/useAnalytics';

interface RootLayoutProps {
  readonly children: ComponentChildren;
}

/**
 * The root layout wraps every route in the app.
 * It's responsible for navigating to the correct start path.
 */
export default function RootLayout({ children }: RootLayoutProps) {
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

  return <>{children}</>;
}

import { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';
import { Router, BaseLocationHook } from 'wouter-preact';
import { memoryLocation } from 'wouter-preact/memory-location';
import { useBrowserLocation } from 'wouter-preact/use-browser-location';

interface RouterProviderProps {
  readonly variant: 'widget' | 'standalone';
  readonly basename?: string;
  readonly initialPath?: string;
  readonly children: ComponentChildren;
}

/**
 * Router wrapper that handles widget vs standalone modes:
 * - widget: Uses memory routing (no browser URL changes)
 * - standalone: Uses browser routing (manages URL history)
 */
export function RouterProvider({
  variant,
  basename = '',
  initialPath = '/',
  children,
}: RouterProviderProps) {
  const hook: BaseLocationHook = useMemo(
    () =>
      variant === 'standalone'
        ? useBrowserLocation
        : memoryLocation({ path: initialPath }).hook,
    [variant, initialPath],
  );

  return (
    <Router hook={hook} base={basename}>
      {children}
    </Router>
  );
}

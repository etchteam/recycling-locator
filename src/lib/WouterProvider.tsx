import { ComponentChildren } from 'preact';
import { Router, BaseLocationHook } from 'wouter-preact';
import { memoryLocation } from 'wouter-preact/memory-location';
import { useBrowserLocation } from 'wouter-preact/use-browser-location';

interface WouterProviderProps {
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
export function WouterProvider({
  variant,
  basename = '',
  initialPath = '/',
  children,
}: WouterProviderProps) {
  const hook: BaseLocationHook =
    variant === 'standalone'
      ? useBrowserLocation
      : memoryLocation({ path: initialPath }).hook;

  return (
    <Router hook={hook} base={basename}>
      {children}
    </Router>
  );
}

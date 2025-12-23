import { useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

/**
 * Restores the scroll position of the main content area when navigating between pages
 * The scroll area being placed on the shadow dom part makes this extra difficult
 */
export default function useScrollRestoration(container: {
  current?: HTMLElement;
}) {
  const [location] = useLocation();

  useEffect(() => {
    container.current
      ?.closest('locator-layout')
      ?.shadowRoot?.querySelector('[part="main"]')
      ?.scrollTo(0, 0);
    container.current?.closest('article')?.scrollTo(0, 0);
  }, [location, container]);
}

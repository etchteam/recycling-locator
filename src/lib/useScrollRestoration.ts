import { useEffect } from 'preact/hooks';
import { useLocation, useNavigation } from 'react-router';

/**
 * Restores the scroll position of the main content area when navigating between
 * The scroll area being placed on the shadow dom part makes this extra difficult
 * https://github.com/remix-run/react-router/pull/10468
 */
export default function useScrollRestoration(
  container: React.RefObject<HTMLElement>,
) {
  const { key } = useLocation();
  const { state } = useNavigation();

  useEffect(() => {
    if (state !== 'idle') {
      return;
    }

    container.current
      ?.closest('locator-layout')
      ?.shadowRoot?.querySelector('[part="main"]')
      ?.scrollTo(0, 0);
    container.current?.closest('article')?.scrollTo(0, 0);
  }, [key, state, container]);
}

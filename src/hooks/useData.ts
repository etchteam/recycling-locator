import { useState, useEffect } from 'preact/hooks';

interface UseDataState<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
}

/**
 * Generic hook for data fetching with loading/error states
 * @param fetcher - Async function that returns the data, or null to skip fetching
 * @param deps - Dependency array for useEffect
 */
export function useData<T>(
  fetcher: (() => Promise<T>) | null,
  deps: unknown[] = [],
): UseDataState<T> {
  const [state, setState] = useState<UseDataState<T>>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!fetcher) {
      setState({ loading: false, data: null, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true }));

    fetcher()
      .then((data) => {
        setState({ loading: false, data, error: null });
      })
      .catch((error) => {
        setState({
          loading: false,
          data: null,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

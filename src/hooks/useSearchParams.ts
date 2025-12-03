import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

/**
 * Wouter-compatible search params hook (Wouter doesn't provide this natively)
 * Returns URLSearchParams and a setter function to update them
 * Follows React Router conventions with setSearchParams naming
 */
export function useSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string>) => void,
] {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(() => {
    const search = location.split('?')[1] || '';
    return new URLSearchParams(search);
  });

  // Update searchParams when location changes
  useEffect(() => {
    const search = location.split('?')[1] || '';
    setSearchParamsState(new URLSearchParams(search));
  }, [location]);

  const setSearchParams = (
    params: URLSearchParams | Record<string, string>,
  ) => {
    const newParams =
      params instanceof URLSearchParams ? params : new URLSearchParams(params);
    const path = location.split('?')[0];
    const search = newParams.toString();
    setLocation(search ? `${path}?${search}` : path);
  };

  return [searchParams, setSearchParams];
}

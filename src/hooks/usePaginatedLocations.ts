import { useSignal } from '@preact/signals';
import { RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useSearchParams } from 'wouter-preact';

import { useLocations } from '@/hooks/useLocations';
import { LocationsResponse } from '@/types/locatorApi';

export interface UsePaginatedLocationsConfig {
  /** Items per page - matches API 'limit' param (default: 30) */
  limit?: number;
  /** Maximum total items to fetch (default: 120) */
  maxLimit?: number;
  /** Default search radius in miles - matches API 'radius' param (default: 25) */
  radius?: number;
}

export interface UsePaginatedLocationsResult {
  /** Locations data from API */
  data: LocationsResponse | null;
  /** Whether data is currently loading */
  loading: boolean;
  /** Number of items currently loaded */
  count: number;
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Whether more items can be loaded */
  hasMore: boolean;
  /** True only during the initial load (no data yet) */
  isInitialLoad: boolean;
  /** Load the next page of results */
  loadMore: () => void;
  /** Ref to attach to the load more button for scroll restoration */
  loadMoreRef: RefObject<HTMLButtonElement>;
}

/**
 * Hook for paginated location fetching with load more functionality
 * Extracts common pagination logic from places list pages
 */
export function usePaginatedLocations(
  config?: UsePaginatedLocationsConfig,
): UsePaginatedLocationsResult {
  const { limit = 30, maxLimit = 120 } = config ?? {};

  const [searchParams, setSearchParams] = useSearchParams();
  const { data: locations, loading } = useLocations();

  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const lastLoadMoreOffset = useSignal<number>(0);

  const count = locations?.items?.length ?? 0;
  const paginationTotal = locations?.pagination?.total ?? limit;
  const currentPage = paginationTotal / limit;
  const materials = searchParams.get('materials');

  // Has more if: we have items, count matches what we requested, and we haven't hit max
  const hasMore =
    count > 0 &&
    materials !== 'undefined' &&
    count >= paginationTotal &&
    paginationTotal !== maxLimit;

  const isInitialLoad = loading && !locations;

  // Scroll position tracking for load more
  useEffect(() => {
    const offset = (loadMoreRef.current?.offsetTop ?? 0) - 200;

    if (lastLoadMoreOffset.value === 0) {
      lastLoadMoreOffset.value = offset;
    } else {
      // Scroll back to where the load more button used to be to fix a bug where some browsers
      // stick users at the bottom of the scroll area ignoring the new content being added above
      loadMoreRef.current
        ?.closest('locator-layout')
        ?.shadowRoot?.querySelector('[part="main"]')
        ?.scrollTo({ top: lastLoadMoreOffset.value });
      lastLoadMoreOffset.value = offset;
    }
  }, [count]);

  const loadMore = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(Number(currentPage) + 1));
    setSearchParams(newParams);
  };

  return {
    data: locations,
    loading,
    count,
    currentPage,
    hasMore,
    isInitialLoad,
    loadMore,
    loadMoreRef,
  };
}

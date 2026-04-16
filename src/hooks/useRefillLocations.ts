import { useLocationsFetch } from '@/hooks/useLocationsFetch';
import { isValidCategory } from '@/lib/refillCategories';

interface UseRefillLocationsOptions {
  /** When true, ignores the categories filter to return all refill locations */
  unfiltered?: boolean;
}

/**
 * Fetches refill locations for the current postcode, reacting to search param changes
 */
export function useRefillLocations({
  unfiltered = false,
}: UseRefillLocationsOptions = {}) {
  return useLocationsFetch({
    endpoint: 'refill-locations',
    buildQueryParams: (searchParams, page) => {
      const params: Record<string, unknown> = {
        limit: page * 30,
        radius: searchParams.get('radius') ?? 25,
      };

      if (!unfiltered) {
        const categories = searchParams.get('categories');

        if (isValidCategory(categories)) {
          params.categories = categories;
        }
      }

      return params;
    },
  });
}

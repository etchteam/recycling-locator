import { useLocationsFetch } from '@/hooks/useLocationsFetch';

/**
 * Fetches refill locations for the current postcode, reacting to search param changes
 */
export function useRefillLocations() {
  return useLocationsFetch({
    endpoint: 'refill-locations',
    buildQueryParams: (searchParams, page) => ({
      limit: page * 30,
      radius: searchParams.get('radius') ?? 25,
      categories: searchParams.get('categories'),
    }),
  });
}

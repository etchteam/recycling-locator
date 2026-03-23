import { useLocationsFetch } from '@/hooks/useLocationsFetch';

/**
 * Fetches locations for the current postcode, reacting to search param changes
 */
export function useLocations() {
  return useLocationsFetch({
    endpoint: 'locations',
    buildQueryParams: (searchParams, page) => ({
      limit: page * 30,
      radius: searchParams.get('radius') ?? 25,
      materials: searchParams.get('materials'),
      category: searchParams.get('category'),
    }),
  });
}

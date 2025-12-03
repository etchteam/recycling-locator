import { useEffect } from 'preact/hooks';

import { useData } from '@/hooks/useData';
import { useSearchParams } from '@/hooks/useSearchParams';
import LocatorApi from '@/lib/LocatorApi';
import { usePostcode } from '@/lib/PostcodeContext';
import mapSearchParams from '@/lib/mapSearchParams';
import { LocationsResponse } from '@/types/locatorApi';

/**
 * Fetches locations for the current postcode, reacting to search param changes
 */
export function useLocations() {
  const { postcode } = usePostcode();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasRequiredParams =
    searchParams.has('limit') && searchParams.has('radius');

  const fetchLocations = () => {
    const queryParams = mapSearchParams(
      ['limit', 'radius', 'materials', 'category'],
      searchParams,
    );

    return LocatorApi.getInstance().get<LocationsResponse>(
      `locations/${postcode}?${queryParams.toString()}`,
    );
  };

  // Set default search params if missing
  useEffect(() => {
    if (!searchParams.has('limit') || !searchParams.has('radius')) {
      const newParams = new URLSearchParams(searchParams);

      if (!newParams.has('limit')) {
        newParams.set('limit', '30');
      }

      if (!newParams.has('radius')) {
        newParams.set('radius', '25');
      }

      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  return useData<LocationsResponse>(
    postcode && hasRequiredParams ? fetchLocations : null,
    [postcode, searchParams],
  );
}

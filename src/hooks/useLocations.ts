import { useEffect } from 'preact/hooks';
import { useSearchParams } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';
import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import PostCodeResolver from '@/lib/PostcodeResolver';
import mapSearchParams from '@/lib/mapSearchParams';
import { LocationsResponse } from '@/types/locatorApi';

/**
 * Fetches locations for the current postcode, reacting to search param changes
 */
export function useLocations() {
  const { postcode: routePostcode } = usePostcode();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasRequiredParams =
    searchParams.has('limit') && searchParams.has('radius');

  const fetchLocations = async () => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const page = Number(searchParams.get('page') ?? 1);

    // If lat/lng are present, resolve to postcode; otherwise use route postcode
    const postcode =
      lat && lng
        ? await PostCodeResolver.fromLatLng(Number(lat), Number(lng))
        : routePostcode;

    const queryParams = mapSearchParams(
      ['limit', 'radius', 'materials', 'category'],
      {
        limit: page * 30,
        radius: searchParams.get('radius') ?? 25,
        category: searchParams.get('category'),
        materials: searchParams.get('materials'),
      },
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

  return useData<LocationsResponse>(hasRequiredParams ? fetchLocations : null, [
    routePostcode,
    searchParams,
  ]);
}

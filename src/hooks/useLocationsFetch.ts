import { useEffect } from 'preact/hooks';
import { useSearchParams } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';
import { UseDataState, useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import PostCodeResolver from '@/lib/PostcodeResolver';
import mapSearchParams from '@/lib/mapSearchParams';
import { LocationsResponse } from '@/types/locatorApi';

export interface LocationsFetchConfig {
  /** API endpoint prefix, e.g. 'locations' or 'refill-locations' */
  endpoint: string;
  /** Build the query params object for the API call */
  buildQueryParams: (
    searchParams: URLSearchParams,
    page: number,
  ) => Record<string, unknown>;
}

/**
 * Shared hook for fetching locations from a given endpoint.
 * Handles postcode resolution, search param defaults, and data fetching.
 */
export function useLocationsFetch(
  config: LocationsFetchConfig,
): UseDataState<LocationsResponse> {
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

    const params = config.buildQueryParams(searchParams, page);
    const queryParams = mapSearchParams(Object.keys(params), params);

    return LocatorApi.getInstance().get<LocationsResponse>(
      `${config.endpoint}/${postcode}?${queryParams.toString()}`,
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

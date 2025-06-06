import { LoaderFunctionArgs } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import { LocationsResponse } from '@/types/locatorApi';

export interface HomeRecyclingCentreLoaderResponse {
  locations: Promise<LocationsResponse>;
}

export default async function homeRecyclingCentreLoader({
  params,
}: LoaderFunctionArgs) {
  const postcode = params.postcode;
  const locations = LocatorApi.get<LocationsResponse>(
    `locations/${postcode}?limit=120&radius=25`,
  );

  return {
    locations: locations,
  };
}

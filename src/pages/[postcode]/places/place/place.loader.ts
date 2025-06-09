import { LoaderFunctionArgs, useRouteLoaderData } from 'react-router-dom';

import LocatorApi from '@/lib/LocatorApi';
import { Location } from '@/types/locatorApi';

export interface PlaceLoaderResponse {
  location: Promise<Location>;
}

export default async function placeLoader({ params }: LoaderFunctionArgs) {
  // TODO(WRAP-207): Use params.id instead
  const location = LocatorApi.getInstance().get<Location>(
    `location/${params.placeName}/${params.placePostcode}`,
  );

  return {
    location,
  };
}

export function usePlaceLoaderData() {
  return useRouteLoaderData('place') as PlaceLoaderResponse;
}

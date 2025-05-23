import { LoaderFunctionArgs, useRouteLoaderData } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import PostCodeResolver from '@/lib/PostcodeResolver';
import { getTipByMaterial, getTipByPath } from '@/lib/getTip';
import mapSearchParams from '@/lib/mapSearchParams';
import { LocationsResponse, RecyclingMeta } from '@/types/locatorApi';

export interface PlacesLoaderResponse {
  locations: Promise<LocationsResponse>;
  tip: Promise<RecyclingMeta>;
}

export default async function placesLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? 1);
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const materials = url.searchParams.get('materials');

  const postcode =
    lat && lng
      ? await PostCodeResolver.fromLatLng(Number(lat), Number(lng))
      : params.postcode;

  const searchParams = mapSearchParams(
    ['limit', 'radius', 'materials', 'category'],
    {
      limit: page * 30,
      radius: url.searchParams.get('radius') ?? 25,
      category: url.searchParams.get('category'),
      materials,
    },
  );

  const locations = LocatorApi.get<LocationsResponse>(
    `locations/${postcode}?${searchParams.toString()}`,
  );

  const tip = materials
    ? getTipByMaterial(materials.split(',')[0])
    : getTipByPath('/:postcode/places');

  return {
    page,
    locations: locations,
    tip,
  };
}

export function usePlacesLoaderData() {
  return useRouteLoaderData('places') as PlacesLoaderResponse;
}

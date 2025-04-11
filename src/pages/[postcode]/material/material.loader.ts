import { defer, LoaderFunctionArgs } from 'react-router-dom';

import LocatorApi from '@/lib/LocatorApi';
import { getTipByMaterial } from '@/lib/getTip';
import mapSearchParams from '@/lib/mapSearchParams';
import {
  LocalAuthority,
  LocationsResponse,
  RecyclingMeta,
  Material,
} from '@/types/locatorApi';

export interface DeferredMaterialLoaderResponse {
  localAuthority: Promise<LocalAuthority>;
  locations: Promise<LocationsResponse>;
  tip: Promise<RecyclingMeta>;
  material: Promise<Material>;
}

export interface AwaitedMaterialLoaderResponse {
  localAuthority: LocalAuthority;
  locations: LocationsResponse;
  tip?: RecyclingMeta;
  material: Material;
}

export default async function materialLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  const postcode = params.postcode;
  const localAuthority = LocatorApi.get<LocalAuthority>(
    `local-authority/${postcode}`,
  );

  const url = new URL(request.url);
  const searchParams = mapSearchParams(
    ['materials', 'category'],
    url.searchParams,
  );
  const locations = LocatorApi.get<LocationsResponse>(
    `locations/${postcode}?${searchParams.toString()}`,
  );

  const material = LocatorApi.get<Material>(
    `materials/${url.searchParams.get('materials')}`,
  );

  const tip = getTipByMaterial(url.searchParams.get('materials'));

  return defer({
    localAuthority,
    locations,
    tip,
    material,
  });
}

import { LoaderFunctionArgs } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import { getTipByMaterial } from '@/lib/getTip';
import mapSearchParams from '@/lib/mapSearchParams';
import {
  LocalAuthority,
  LocationsResponse,
  RecyclingMeta,
  Material,
  DoorstepCollection,
} from '@/types/locatorApi';

export interface DeferredMaterialLoaderResponse {
  localAuthority: Promise<LocalAuthority>;
  locations: Promise<LocationsResponse>;
  tip: Promise<RecyclingMeta>;
  material: Promise<Material>;
  doorstepCollections: Promise<DoorstepCollection[]>;
}

export interface AwaitedMaterialLoaderResponse {
  localAuthority: LocalAuthority;
  locations: LocationsResponse;
  tip?: RecyclingMeta;
  material: Material;
  doorstepCollections: DoorstepCollection[];
}

export default async function materialLoader({
  request,
  params,
}: LoaderFunctionArgs): Promise<DeferredMaterialLoaderResponse> {
  const postcode = params.postcode;
  const localAuthority = LocatorApi.getInstance().get<LocalAuthority>(
    `local-authority/${postcode}`,
  );

  const url = new URL(request.url);
  const searchParams = mapSearchParams(
    ['materials', 'category'],
    url.searchParams,
  );
  const locations = LocatorApi.getInstance().get<LocationsResponse>(
    `locations/${postcode}?${searchParams.toString()}`,
  );

  const materialIds = url.searchParams.get('materials');

  const material = LocatorApi.getInstance().get<Material>(
    `materials${materialIds ? `/${materialIds}` : ''}`,
  );

  let doorstepCollections: Promise<DoorstepCollection[]>;

  // We only support looking up a single material for doorstep collections, so
  // if there are multiple materials, we return an empty array. We also do not
  // bother looking up doorstep collections if we do not have a material to
  // look for.
  if (!materialIds || materialIds.includes(',')) {
    doorstepCollections = Promise.resolve([]);
  } else {
    doorstepCollections = LocatorApi.getInstance().get<DoorstepCollection[]>(
      `doorstep-collections/${postcode}/${materialIds}`,
    );
  }

  const tip = getTipByMaterial(url.searchParams.get('materials') ?? '');

  return {
    localAuthority,
    locations,
    tip,
    material,
    doorstepCollections,
  };
}

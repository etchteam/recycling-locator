import { defer } from 'react-router-dom';

import LocatorApi from '@/lib/LocatorApi';
import { Material } from '@/types/locatorApi';

export interface PlacesSearchAtoZLoaderResponse {
  materials: Promise<Material[]>;
}

export default async function placesSearchAtoZLoader() {
  const materials = LocatorApi.getInstance().get<Material[]>('materials');

  return defer({ materials });
}

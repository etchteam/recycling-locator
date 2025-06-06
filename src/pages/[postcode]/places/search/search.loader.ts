import LocatorApi from '@/lib/LocatorApi';
import { captureException } from '@/lib/sentry';
import { Material } from '@/types/locatorApi';

export interface PlacesSearchLoaderResponse {
  popularMaterials: Promise<Material[]>;
}

export default async function placesSearchLoader() {
  const popularMaterials = LocatorApi.get<Material[]>(
    'materials?popular=true',
  ).catch((error) => {
    captureException(error, { route: 'Places search loader' });
    return Promise.resolve([]);
  });

  return { popularMaterials };
}

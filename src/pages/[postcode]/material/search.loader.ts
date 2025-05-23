import { defer } from 'react-router-dom';

import LocatorApi from '@/lib/LocatorApi';
import { getTipByPath } from '@/lib/getTip';
import { captureException } from '@/lib/sentry';
import { Material, RecyclingMeta } from '@/types/locatorApi';

export interface MaterialSearchLoaderResponse {
  popularMaterials: Promise<Material[]>;
  tip: Promise<RecyclingMeta>;
}

export default async function materialSearchLoader() {
  const popularMaterials = LocatorApi.get<Material[]>(
    'materials?popular=true',
  ).catch((error) => {
    captureException(error, { route: 'Material search loader' });
    return Promise.resolve([]);
  });

  const tip = getTipByPath('/:postcode/material/search');

  return defer({ popularMaterials, tip });
}

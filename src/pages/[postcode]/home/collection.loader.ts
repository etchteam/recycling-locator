import { getTipByPath } from '@/lib/getTip';
import { RecyclingMeta } from '@/types/locatorApi';

export interface HomeCollectionLoaderResponse {
  tip?: Promise<RecyclingMeta>;
}

export default function homeCollectionLoader() {
  const tip = getTipByPath('/:postcode/home/collection');
  return { tip };
}

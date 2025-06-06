import { getTipByPath } from '@/lib/getTip';
import { RecyclingMeta } from '@/types/locatorApi';

export interface StartLoaderResponse {
  tip?: Promise<RecyclingMeta>;
}

export default function startLoader() {
  const tip = getTipByPath('/', { fallback: false });
  return { tip };
}

import { defer } from 'react-router-dom';

import { getTipByPath } from '@/lib/getTip';
import { RecyclingMeta } from '@/types/locatorApi';

export interface StartLoaderResponse {
  tip?: Promise<RecyclingMeta>;
}

export default function startLoader() {
  const tip = getTipByPath('/');
  return defer({ tip });
}

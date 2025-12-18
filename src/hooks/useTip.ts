import { useData } from '@/hooks/useData';
import { getTipByMaterial, getTipByPath } from '@/lib/getTip';
import { RecyclingMeta } from '@/types/locatorApi';

interface UseTipOptions {
  path?: string;
  materialId?: string;
}

/**
 * Fetches a tip/hint for a given path or material
 */
export function useTip(options: UseTipOptions = {}) {
  const { path, materialId } = options;

  const fetchTip = () => {
    return materialId ? getTipByMaterial(materialId) : getTipByPath(path);
  };

  return useData<RecyclingMeta>(path || materialId ? fetchTip : null, [
    path,
    materialId,
  ]);
}

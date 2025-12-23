import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { Material } from '@/types/locatorApi';

/**
 * Fetches all materials for A-Z listing
 */
export function useMaterials() {
  const fetchMaterials = () => {
    return LocatorApi.getInstance().get<Material[]>('materials');
  };

  return useData<Material[]>(fetchMaterials, []);
}

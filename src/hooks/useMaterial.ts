import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { Material } from '@/types/locatorApi';

/**
 * Fetches material details by ID.
 * Returns null data if no materialId is provided.
 */
export function useMaterial(materialId: string | null) {
  const fetchMaterial = () => {
    if (!materialId) {
      return Promise.resolve(null);
    }
    return LocatorApi.getInstance().get<Material>(`materials/${materialId}`);
  };

  return useData<Material | null>(fetchMaterial, [materialId]);
}

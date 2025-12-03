import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { Material } from '@/types/locatorApi';

/**
 * Fetches material details by ID
 */
export function useMaterial(materialId: string | null) {
  const fetchMaterial = () => {
    return LocatorApi.getInstance().get<Material>(`materials/${materialId}`);
  };

  return useData<Material>(materialId ? fetchMaterial : null, [materialId]);
}

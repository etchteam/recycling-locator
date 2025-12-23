import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { Material } from '@/types/locatorApi';

/**
 * Fetches material details by ID
 * If materialId is null, fetches generic material data (used for categories)
 */
export function useMaterial(materialId: string | null) {
  const fetchMaterial = () => {
    const path = materialId ? `materials/${materialId}` : 'materials';
    return LocatorApi.getInstance().get<Material>(path);
  };

  return useData<Material>(fetchMaterial, [materialId]);
}

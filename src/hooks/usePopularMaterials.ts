import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { captureException } from '@/lib/sentry';
import { Material } from '@/types/locatorApi';

/**
 * Fetches popular materials for search suggestions
 */
export function usePopularMaterials() {
  const fetchPopularMaterials = async () => {
    try {
      return await LocatorApi.getInstance().get<Material[]>(
        'materials?popular=true',
      );
    } catch (error) {
      captureException(error, { hook: 'usePopularMaterials' });
      return [];
    }
  };

  return useData<Material[]>(fetchPopularMaterials, []);
}

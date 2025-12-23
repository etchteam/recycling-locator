import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { MaterialCategory } from '@/types/locatorApi';

/**
 * Fetches material categories for browse/search
 */
export function useMaterialCategories() {
  const fetchMaterialCategories = () => {
    return LocatorApi.getInstance().get<MaterialCategory[]>(
      'material-categories',
    );
  };

  return useData<MaterialCategory[]>(fetchMaterialCategories, []);
}

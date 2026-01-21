import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { MaterialCategory } from '@/types/locatorApi';

/**
 * Fetches a single material category by ID
 */
export function useCategory(categoryId: string | null) {
  const fetchCategory = () => {
    if (!categoryId) {
      return Promise.resolve(null);
    }
    return LocatorApi.getInstance().get<MaterialCategory>(
      `material-categories/${categoryId}`,
    );
  };

  return useData<MaterialCategory | null>(fetchCategory, [categoryId]);
}

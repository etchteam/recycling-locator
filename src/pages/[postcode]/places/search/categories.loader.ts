import LocatorApi from '@/lib/LocatorApi';
import { MaterialCategory } from '@/types/locatorApi';

export interface PlacesSearchCategoriesLoaderResponse {
  materialCategories: Promise<MaterialCategory[]>;
}

export default async function placesSearchCategoriesLoader() {
  const materialCategories = LocatorApi.getInstance().get<MaterialCategory[]>(
    'material-categories',
  );

  return { materialCategories };
}

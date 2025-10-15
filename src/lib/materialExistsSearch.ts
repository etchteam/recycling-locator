import LocatorApi from '@/lib/LocatorApi';
import { captureException } from '@/lib/sentry';
import { Material } from '@/types/locatorApi';

async function getMaterialsList(query: string): Promise<Material[]> {
  try {
    const body = new FormData();
    body.append('search', query);
    return LocatorApi.getInstance().post('materials', body);
  } catch (error) {
    captureException(error, { component: 'MaterialSearchInput' });
    return Promise.resolve([]);
  }
}

export default async function materialExistsSearch(
  search: string,
): Promise<boolean> {
  const materials = await getMaterialsList(search);
  return !!materials.find(
    (m) => m.name.toLocaleLowerCase() === search.toLocaleLowerCase().trim(),
  );
}

import { redirect } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import { MaterialSearch } from '@/types/locatorApi';

export default async function materialSearchRedirect(
  formData: FormData,
  postcode: string,
  path: string,
) {
  const search = formData.get('search') as string;
  const materials = await LocatorApi.getInstance().post<MaterialSearch[]>(
    'materials',
    formData,
  );
  const material =
    materials.find(
      (m) => m.name.toLocaleLowerCase() === search.toLocaleLowerCase().trim(),
    ) ?? materials[0];
  const searchParams = new URLSearchParams();
  searchParams.set('search', material?.name ?? search);

  if (!material) {
    return redirect(`/${postcode}/${path}/search?${searchParams.toString()}`);
  }

  const searchType =
    material.type === 'LocatorMaterialCategory' ? 'category' : 'materials';
  searchParams.set(searchType, material.id);
  return redirect(`/${postcode}/${path}?${searchParams.toString()}`);
}

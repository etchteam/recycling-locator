import { ActionFunctionArgs, redirect } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import { MaterialSearch } from '@/types/locatorApi';

export default async function postcodeAction({
  request,
  params,
}: ActionFunctionArgs) {
  const postcode = params.postcode;
  const formData = await request.formData();
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
    return redirect(`/${postcode}/material/search?${searchParams.toString()}`);
  }

  const searchType =
    material.type === 'LocatorMaterialCategory' ? 'category' : 'materials';
  searchParams.set(searchType, material.id);

  return redirect(`/${postcode}/material?${searchParams.toString()}`);
}

import { ActionFunctionArgs, redirect } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import { MaterialSearch } from '@/types/locatorApi';

export default async function placesSearchAction({
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
  const material = materials.find((m) => m.name === search);
  const searchParams = new URLSearchParams();
  searchParams.set('search', search);

  if (material) {
    const searchType =
      material.type === 'LocatorMaterialCategory' ? 'category' : 'materials';
    searchParams.set(searchType, material.id);
  } else {
    searchParams.set('materials', 'undefined');
  }

  return redirect(`/${postcode}/places?${searchParams.toString()}`);
}

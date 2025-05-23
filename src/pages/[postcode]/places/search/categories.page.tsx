import { Suspense } from 'preact/compat';
import { Await, useLoaderData, useParams } from 'react-router';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/composition/Wrap/Wrap';
import MaterialCategoriesNav from '@/components/control/MaterialCategoriesNav/MaterialCategoriesNav';

import { PlacesSearchCategoriesLoaderResponse } from './categories.loader';

export default function CategoriesPage() {
  const { postcode } = useParams();
  const { materialCategories: materialCategoriesPromise } =
    useLoaderData() as PlacesSearchCategoriesLoaderResponse;

  return (
    <Suspense fallback={null}>
      <Await resolve={materialCategoriesPromise}>
        {(materialCategories) => (
          <diamond-enter type="fade">
            <MaterialCategoriesNav
              basePath={`/${postcode}/places`}
              materialCategories={materialCategories}
            />
          </diamond-enter>
        )}
      </Await>
    </Suspense>
  );
}

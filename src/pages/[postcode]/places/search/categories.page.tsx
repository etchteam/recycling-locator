import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/composition/Wrap/Wrap';
import MaterialCategoriesNav from '@/components/control/MaterialCategoriesNav/MaterialCategoriesNav';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useMaterialCategories } from '@/hooks/useMaterialCategories';

export default function CategoriesPage() {
  const { postcode } = usePostcode();
  const { data: materialCategories, loading } = useMaterialCategories();

  if (loading || !materialCategories) {
    return null;
  }

  return (
    <diamond-enter type="fade">
      <MaterialCategoriesNav
        basePath={`/${postcode}/places`}
        materialCategories={materialCategories}
      />
    </diamond-enter>
  );
}

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
    <evg-enter type="fade">
      <MaterialCategoriesNav
        basePath={`/${postcode}/places`}
        materialCategories={materialCategories}
      />
    </evg-enter>
  );
}
